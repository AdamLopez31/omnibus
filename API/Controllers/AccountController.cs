using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {

        private readonly UserManager<User> _userManager;
        public AccountController(UserManager<User> userManager)
        {
            //allow us to login and register users into our application
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(LoginDto loginDto) {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if(user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password)) 
            return Unauthorized();

            return user;
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
    }
}