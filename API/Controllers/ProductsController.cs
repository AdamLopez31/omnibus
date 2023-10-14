using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    
    public class ProductsController : BaseApiController
    {
        //IN ORDER TO USE DEPEDENCY INJECTION CREATE PRIVATE FIELD IN CLASS
        private readonly StoreContext _context;
        public ProductsController(StoreContext context)
        {
            _context = context;
        }

        //END POINT RETURN TASK FOR ASYNCHRONOUS QUERYING
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts() {
            return await _context.Products.ToListAsync();
        }

        //FOR DEBUGGING
        //EXECUTE THIS METHOD WHEN CODE IS ALREADY RUNNING launch.json .net core attach
        // ATTACH TO ALREADY RUNNING PROCESS .NET Core Launch (web) looK FOR API.exe
        [HttpGet("{id}")] //api/products/3
        public async Task<ActionResult<Product>> GetProduct(int id) {
            var product = await _context.Products.FindAsync(id);
            //to ensure 404 error not 204 no content error check to see if product is not null
            if(product == null) return NotFound();

            return product;
        }
    }
}