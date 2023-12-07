using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {

        private readonly UserManager<User> _userManager;

        private readonly TokenService _tokenService;
        public AccountController(UserManager<User> userManager, TokenService tokenService)
        {
            //allow us to login and register users into our application
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if(user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password)) 
            return Unauthorized();

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user)
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

            return new UserDto {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user)
            };

        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId)) {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            var basket = await _context.Baskets 
            //IF WE DO HAVE A BUYER ID EITHER USERNAME OR COOKIE RETURN MATCHING BASKET
             .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
            return basket;
        }
    }
}