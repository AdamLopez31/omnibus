using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //ONE OF THE POWERS API CONTROLLER HAS IS MANAGE MODEL STATE ERRORS
    [ApiController]
    //USING PLACEHOLDER [controller] MAKES THIS VALID FOR ANY CONTROLLER
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        
    }
}