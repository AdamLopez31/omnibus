using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    //TO PLURALIZE TABLE NAME
    //USE DATA ANNOTATIONS
    [Table("BasketItems")]

    public class BasketItem
    {
        public int Id { get; set; }

        public int Quantity { get; set; }

        //RELATION NAVIGATION PROPERTIES

        public int ProductId { get; set; }


        //ONE TO ONE RELATIONSHIP WITH PRODUCT ITSELF
        public Product Product { get; set; }

        public int BasketId { get; set; }

        public Basket Basket { get; set; }



        
    }
}