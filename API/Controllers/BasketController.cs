using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
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
        [HttpGet]
        public async Task<ActionResult<Basket>> GetBasket() {
            //USE COOKIE TO IDENTIFY BASKET
            //WHEN USER CREATES A BASKET ON SERVER A BUYERID WILL BE RETURNED SENT
            //BACK AS A COOKIE COOKIES STORE IN USER'S BROWSER IN STORAGE
            //FOR EVERY REQUEST AND RESPONSE WE USE THE COOKIE AND IT GOES BACKWARDS
            //AND FORWARDS BETWEEN CLIENT AND SERVER
            var basket = await _context.Baskets
            //EXPLICITLY RETURN BASKET ITEMS ENTITY FRAMEWORK WILL INCLUDE RELATED ITEMS WITH BASKET
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);

            if(basket == null) return NotFound();

            return basket;
        }




        //2. add item to basket
        [HttpPost]
        public async Task<ActionResult> AddItemToBasket(int productId, int quantity) {

            //get basket or create basket

            //get product

            //add item

            //save changes
            return StatusCode(201);
        }


        //3. remove item from basket or reduce quantity of basket
        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity) {

            //get basket

            

            //remove item or reduce quantity

            //save changes
            return Ok();
        }

    }
}