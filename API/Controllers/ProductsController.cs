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

        [HttpGet("{id}")] //api/products/3
        public async Task<ActionResult<Product>> GetProduct(int id) {
            return await _context.Products.FindAsync(id);
        }
    }
}