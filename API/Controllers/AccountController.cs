using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {

        private readonly UserManager<User> _userManager;

        private readonly TokenService _tokenService;

        private readonly StoreContext _context;
        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            //allow us to login and register users into our application
            _userManager = userManager;
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if(user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password)) 
            return Unauthorized();

            var userBasket = await RetrieveBasket(loginDto.Username);

            var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            //CHECK TO SEE IF WE HAVE ANONYMOUS BASKET IF WE DO AND WE'RE LOGGING IN
            //WE NEED TO TRANSFER THIS ANONYMOUS BASKET TO OUR USER AND REMOVE ANONYMOUS BASKET

            if (anonBasket != null)
            {
                //IF THEY ALREADY HAVE A USER BASKET ON THE SERVER AND THEY HAVE AN ANONYMOUS BASKET
                //WE'RE GOING TO DELETE THE USER BASKET THE AND CHANGE THE NAME OF THE BUYERID IN THE ANONYMOUS BASKET
                //TO THE USERNAME anonBasket != null so we want to transfer that to user 
                if(userBasket != null) _context.Baskets.Remove(userBasket);
                anonBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");//REMOVE FROM CLIENT'S BROWSER
                await _context.SaveChangesAsync();
            }

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                //RETURN BASKET TO USER
                Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
            };
        }



        //NOT GOING TO RETURN USER FROM METHOD AFTER REGISTER ASK THEM TO LOG IN
         [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto) {
            var user = new User {UserName = registerDto.Username, Email = registerDto.Email};

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded)
            {
                //contains an array of errors
                foreach(var error in result.Errors) {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user,"Member");

            //successfully created but won't give information to get the user from
            return StatusCode(201);
        }


        //TO PROTECT ENDPOINT
        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser() {
            //WILL GET NAME CLAIM FROM TOKEN USING User.Identity.Name
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var userBasket = await RetrieveBasket(User.Identity.Name);

            return new UserDto {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto()
            };

        }

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress() {
            return await _userManager.Users
            .Where(x => x.UserName == User.Identity.Name)
            .Select(user => user.Address)
            .FirstOrDefaultAsync();
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId)) {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            var basket = await _context.Baskets 
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
            return basket;
        }
    }
}