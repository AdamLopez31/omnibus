using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.OrderAggregate
{
    public class OrderItem
    {
        public int Id { get; set; }


        //ProductItemOrdered IS OWNED PROPERTY IN ORDERITEM TABLE WE EXPECT TO SEE ProductItemOrdered
        public ProductItemOrdered ItemOrdered { get; set; }

        public long Price { get; set; }

        public int Quantity { get; set; }
    }
}