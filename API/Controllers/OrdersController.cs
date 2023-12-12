using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    //MAKE SURE WERE GETTING THE ORDERS SPECIFICALLY FOR THE LOGGED IN USER
    //NO ANONYMOUS ACCESS FOR CONTROLLER
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Order>>> GetOrders() {
            //return orders with orderItems
            return await _context.Orders
            .Include(o => o.OrderItems)
            .Where(x => x.BuyerId == User.Identity.Name)
            .ToListAsync();
        }

        //ID OF ORDER
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id) {
            return await _context.Orders
            .Include(o => o.OrderItems)
            .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
            .FirstOrDefaultAsync();
        }
    }
}