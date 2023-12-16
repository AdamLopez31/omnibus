using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class OrderDto
    {
        
        public int Id { get; set; }

        //BuyerId USER'S USERNAME
        public string BuyerId { get; set; }


       
        public ShippingAddress ShippingAddress { get; set; }


        //WE WE CREATE A NEW INSTANCE OF AN ORDER THIS GETS AUTOMATICALLY SET
        public DateTime OrderDate { get; set; } 

        public List<OrderItemDto> OrderItems { get; set; }

        public long Subtotal { get; set; }

        public long DeliveryFee { get; set; }

        public string OrderStatus { get; set; }

        public long Total { get; set; }

        
    }
}