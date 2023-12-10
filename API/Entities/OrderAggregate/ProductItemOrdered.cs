using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    [Owned]
    public class ProductItemOrdered
    {
        //SNAPSHOT OF ITEM WHEN IT WAS ORDERED STORED IN ORDER ITEM TABLE
        public int ProductId { get; set; }

        public string Name { get; set; }

        public string PictureUrl { get; set; }
    }
}