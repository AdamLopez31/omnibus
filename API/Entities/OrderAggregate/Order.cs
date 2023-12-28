using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.OrderAggregate
{
    public class Order
    {
        public int Id { get; set; }

        //BuyerId USER'S USERNAME
        public string BuyerId { get; set; }


        //BECAUSE ShippingAddress IS AN OWNED PROPERTY HAVE TO MAKE IT REQUIRED
        [Required]
        public ShippingAddress ShippingAddress { get; set; }


        //WE WE CREATE A NEW INSTANCE OF AN ORDER THIS GETS AUTOMATICALLY SET
        public DateTime OrderDate { get; set; } = DateTime.Now;

        public List<OrderItem> OrderItems { get; set; }

        public long Subtotal { get; set; }

        public long DeliveryFee { get; set; }

        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;

        public long GetTotal() {
            return Subtotal + DeliveryFee;
        }

        public string PaymentIntentId { get; set; }
    }
}