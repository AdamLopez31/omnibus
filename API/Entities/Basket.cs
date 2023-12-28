using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }

        //ALLOW USERS TO ADD ITEMS TO BASKET WITHOUT SIGNING IN
        //GIVE USER RANDOMLY GENERATED ID TO DETERMINE WHOSE BASKET BELONGS TO WHO
        public string BuyerId { get; set; }
        

        //TO PREVENT LIST UNDEFINED SCENARIOS INITIALIZE NEW LIST
        //ONE TO MAY RELATIONSHIP ONE BASKET HAS MANY ITEMS
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();

        public string PaymentIntentId { get; set; }

        //CLIENT CAN MAKE PAYMENT TO STRIPE DIRECTLY WITHOUT HAVING TO GO THROUGH OUR API
        public string ClientSecret { get; set; }

        public void AddItem(Product product, int quantity) {
            //.ALL() IF WE HAVE ITEMS IN OUR BASKET IT WILL RETURN TRUE 
            if(Items.All(item => item.ProductId != product.Id)) {
                Items.Add(new BasketItem {Product = product, Quantity = quantity});
            }

            //IF WE ALREADY HAVE ITEM IN OUR BASKET ADJUST QUANTITY
            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);

            //+= ADDITION ASSIGNMENT OPERATOR  existingItem.Quantity = existingItem.Quantity + quantity
            if(existingItem != null) existingItem.Quantity += quantity;

        }

        public void RemoveItem(int productId, int quantity) {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            //not able to reduce quantity if null
            if(item == null) return;
            item.Quantity -= quantity;
            //IF ITEM QUANTITY IS ZERO REMOVE FROM LIST
            if(item.Quantity == 0) Items.Remove(item);
        }
    }
}