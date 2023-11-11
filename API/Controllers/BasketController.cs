using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
        }

        //3 endpoints
        //1. to fetch individual basket
        //SPECIFIY NAME OF ROUTE GetBasket
        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            //USE COOKIE TO IDENTIFY BASKET
            //WHEN USER CREATES A BASKET ON SERVER A BUYERID WILL BE RETURNED SENT
            //BACK AS A COOKIE COOKIES STORE IN USER'S BROWSER IN STORAGE
            //FOR EVERY REQUEST AND RESPONSE WE USE THE COOKIE AND IT GOES BACKWARDS
            //AND FORWARDS BETWEEN CLIENT AND SERVER
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();
            return MapBasketToDto(basket);
        }

        

        //2. add item to basket use query string
        [HttpPost] //api/basket?productId=3&quantity=2 ONE OF THE POWERS API CONTROLLER HAS ABLE TO READ QUERY STRING
        //AS LONG AS KEYS IN QUERY STRING MATCHES NAMES IN PARAMETERS IT WILL KNOW THAT'S WHERE WE WANT TO GET THEM FROM
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity) {

            //get basket or create basket
            //RetrieveBasket method will either retrieve us a basket or it's going to 
            //be null if FirstOrDefaultAsync method doesn't find what's it's looking for 
            //in database it will return default value for an object: which is null
            var basket = await RetrieveBasket();
            if(basket == null) basket = CreateBasket();
    
            //get product
            var product = await _context.Products.FindAsync(productId);
            if(product == null) return BadRequest(new ProblemDetails{Title = "Product not found"});

            //add item
            basket.AddItem(product,quantity);

            //save changes
            //SaveChangesAsync returns integer of how many changes we made in database 
            // > 0 we know something has happened to our database
            var result = await _context.SaveChangesAsync() > 0;
            //GetBasket will add location header to response
            if(result) return CreatedAtRoute("GetBasket",MapBasketToDto(basket));

            return BadRequest(new ProblemDetails {Title = "Problem saving product to basket"});
        }

        


        //3. remove item from basket or reduce quantity of basket
        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity) {

            //get basket
            var basket = await RetrieveBasket();
            if(basket == null) return NotFound();

            //remove item or reduce quantity
            basket.RemoveItem(productId,quantity);

            //save changes
            var result = await _context.SaveChangesAsync() > 0;
            if(result) return StatusCode(201);

            return BadRequest(new ProblemDetails {Title = "Problem removing item from basket"});

        }

        private async Task<Basket> RetrieveBasket()
        {
            var basket = await _context.Baskets
            //EXPLICITLY RETURN BASKET ITEMS ENTITY FRAMEWORK WILL INCLUDE RELATED ITEMS WITH BASKET
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
            return basket;
        }

        private Basket CreateBasket()
        {
            //add buyer ID randomly generated number globally unique identifier
            var buyerId = Guid.NewGuid().ToString();
            
            //EUROPEAN POLICY ON COOKIES FORCE USERS TO ACCEPT COOKIES ON WEBSITE 
            //SPECIFY COOKIE IS ESSENTIAL TO OPERATION OF WEBSITE
            var cookieOptions = new CookieOptions {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30)
            };
            //BECAUSE WE'RE IN A CONTROLLER WE HAVE ACCESS TO THE HTTP RESPONSE WE'RE GOING TO SEND BACK
            Response.Cookies.Append("buyerId",buyerId, cookieOptions);

            var basket = new Basket{BuyerId = buyerId};
            //ENTITY FRAMEWORK WILL START TRACKING THIS NEW ENTITY WE'VE CREATED
            _context.Baskets.Add(basket);

            return basket;
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }

    }
}