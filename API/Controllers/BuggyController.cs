using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        [HttpGet("not-found")]
        public ActionResult GetNotFound()
        {
            //404 ERROR
            return NotFound();
        }

        [HttpGet("bad-request")]
        public ActionResult GetBadRequest()
        {
            //400 ERROR
            return BadRequest(new ProblemDetails{Title = "This is a bad request"});
        }

        [HttpGet("unauthorized")]
        public ActionResult GetUnAuthorized()
        {
            //401 ERROR
            return Unauthorized();
        }

        [HttpGet("validation-error")]
        public ActionResult GetValidationError()
        {
            //if user filling out form haven't supplied required fields
            //ONE OF THE POWERS API CONTROLLER HAS IS MANAGE MODEL STATE ERRORS
                                    //key/value pairs
            ModelState.AddModelError("Problem1","This is the first error");
            ModelState.AddModelError("Problem2","This is the second error");
            //returns 400 bad request and array of errors that occurred in model state
            return ValidationProblem();
        }

        [HttpGet("server-error")]
        public ActionResult GetServerError()
        {
            //RETURNS EXCEPTION
            throw new Exception("This is a server error");
        }
        
    }
}