using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        //REPRESENTS TABLE IN DATABASE
        public DbSet<Product> Products {get;set;}

        //BASKETS WILL INCLUDE BASKET ITEMS
        public DbSet<Basket> Baskets { get; set; }
    }
}