namespace API.Entities
{
    //PUBLIC ACCESSIBLE FROM ALL PARTS OF OUR APPLICATION
    //PROTECTED ACCESSIBLE TO THIS CLASS AND ALL OTHERS THAT DERIVE FROM IT
    public class Product
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        //CHOSE LONG FOR PAYMENT PROVIDER
        public long Price { get; set; } //10000

        public string PictureUrl { get; set; }

        public string Type { get; set; }

        public string  Brand { get; set; }

        public int QuantityInStock { get; set; }
    }
}