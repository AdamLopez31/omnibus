using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        private readonly IHostEnvironment _env;

        
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;
        }

        //BECAUSE THIS IS A MIDDLEWARE
        public async Task InvokeAsync(HttpContext context) {
            try
            {
                await
            }
            catch (System.Exception)
            {
                
                throw;
            }
        }
    }
}