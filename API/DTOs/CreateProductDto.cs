using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CreateProductDto
    {

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        //CHOSE LONG FOR PAYMENT PROVIDER 100 is one dollar
        [Required]
        [Range(100, double.PositiveInfinity)]
        public long Price { get; set; } //10000

        [Required]
        public IFormFile File { get; set; }


        [Required]
        public string Type { get; set; }

        [Required]
        public string  Brand { get; set; }

        [Required]
        [Range(0,200)]
        public int QuantityInStock { get; set; }
    }
}