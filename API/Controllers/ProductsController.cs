using System.Text.Json;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    
    public class ProductsController : BaseApiController
    {
        //IN ORDER TO USE DEPEDENCY INJECTION CREATE PRIVATE FIELD IN CLASS
        //AUTOMAPPER INTERFACE IMAPPER
        private readonly StoreContext _context;

        private readonly IMapper _mapper;

        private readonly ImageService _imageService;
        public ProductsController(StoreContext context,IMapper mapper, ImageService imageService)
        {
            _imageService = imageService;
            _mapper = mapper;
            _context = context;
            
        }

        //END POINT RETURN TASK FOR ASYNCHRONOUS QUERYING
        //CHANGED PARAMETERS FROM STRINGS TO OBJECT API ASSUMES STRINGS IN PARAMETER ARE PASSED AS QUERY STRINGS
        //IF WERE PASSING AN OBJECT AS PARAMETERS IT WILL PRESUME IT'S GOING TO GET THESE VALUES FROM 
        //THE BODY OF OUR REQUEST IF WE WANT TO USE AN OBJECT AS OUR PARAMETER WE NEED TO TELL OUR API CONTROLLER WHERE
        //TO LOOK TO GO AND GET PARAMETERS add attribute [FromQuery]
        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productParams) {
            
            //NOT EXECUTING ANYTHING AGAINST THE DATABASE AT THIS POINT
            var query = 
            _context.Products.Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands,productParams.Types)
            .AsQueryable();

            
            var products = await PagedList<Product>.ToPagedList(query,productParams.PageNumber,productParams.PageSize);

            //RETURN IN RESPONSE HEADERS AND GET ACCESS TO OUR PAGINATION FROM OUR RESPONSE HEADERS
            //product metadata object serialized into json RETURN AS PAGINATION HEADER
            Response.AddPaginationHeader(products.MetaData);


            return products;
            //return await query.ToListAsync();
            //return await _context.Products.ToListAsync(); instead of executing this right away
        }

        //FOR DEBUGGING EXAMPLE
        //EXECUTE THIS METHOD WHEN CODE IS ALREADY RUNNING launch.json .net core attach
        // ATTACH TO ALREADY RUNNING PROCESS .NET Core Launch (web) looK FOR API.exe
        [HttpGet("{id}", Name = "GetProduct")] //api/products/3
        public async Task<ActionResult<Product>> GetProduct(int id) {
            var product = await _context.Products.FindAsync(id);
            //to ensure 404 error not 204 no content error check to see if product is not null
            if(product == null) return NotFound();

            return product;
        }

        //ROUTE PARAMETER filters
        [HttpGet("filters")]

        public async Task<IActionResult> GetFilters() {
            //USING IACTIONRESULT WE HAVE ACCESS TO ALL THE HTTP RESPONSES LIKE NotFound() ETC
            //JUST DONT GET TYPE SAFETY WITH OUR RESPONSE
            //SELECT ALLOWS US TO PROJECT INTO SOMETHING OTHER THAN OUR PRODUCTS
            //DISTINCT ONLY WANT THE UNIQUE VALUES OF EACH BRAND INSIDE OUR DATABASE
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            //ANONYMOUS OBJECT WITH TWO LISTS
            return Ok(new {brands,types});  
        }


        //ONLY ADMINS HTTP POST NEW RESOURCE ON SERVER
        //[FromForm] means we'll get image from form not body of request where to look for product dto
        //MULTIPART/FORM DATA TYPE OF REQUEST
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm]CreateProductDto productDto) {

            var product = _mapper.Map<Product>(productDto);

            if(productDto.File != null) {
                var imageResult = await _imageService.AddImageAsync(productDto.File);

                if(imageResult.Error != null) return BadRequest(new ProblemDetails {Title = imageResult.Error.Message});

                product.PictureUrl = imageResult.SecureUrl.ToString();

                product.PublicId = imageResult.PublicId;
            }
            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            //CREATED AT ROUTE CREATING NEW RESOURCE ON THE SERVER 
            //CreatedAtRoute() parameters//route name/route value/object value:Product
            if(result) return CreatedAtRoute("GetProduct", new {Id = product.Id}, product);

            return BadRequest(new ProblemDetails{Title = "Problem creating new product"});

        }


        [Authorize(Roles = "Admin")]
        [HttpPut]
         public async Task<ActionResult<Product>> UpdateProduct([FromForm]UpdateProductDto productDto) {

            //EDITING RESOURCE 1ST GET RESOURCE WE WANT TO EDIT

            var product = await _context.Products.FindAsync(productDto.Id);

            if(product == null) return NotFound();

             //WHERE ARE WE GOING TO GO FROM - WHERE ARE WE GOING TO GO TO
             _mapper.Map(productDto, product);

             
            if(productDto.File != null) {
                var imageResult = await _imageService.AddImageAsync(productDto.File);

                if(imageResult.Error != null) return BadRequest(new ProblemDetails {Title = imageResult.Error.Message});

                //KNOW IMAGE IS IN CLOUDINARY IF PUBLIC ID IS NOT NULL OR EMPTY
                if(!string.IsNullOrEmpty(product.PublicId)) await _imageService.DeleteImageAsync(product.PublicId);

                product.PictureUrl = imageResult.SecureUrl.ToString();

                product.PublicId = imageResult.PublicId;
               
            }



             //WHAT WE NEED TO DO WHEN WE'RE UPDATING AN ENTITY
             var result = await _context.SaveChangesAsync() > 0;
             //204 resource has been updated on database
             if(result) return Ok(product);

             return BadRequest(new ProblemDetails { Title = "Problem updating product"});
        }

        [Authorize(Roles = "Admin")]
        //ROUTE PARAMETER
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id) {
             var product = await _context.Products.FindAsync(id);

             if(product == null) return NotFound();

             if(!string.IsNullOrEmpty(product.PublicId)) await _imageService.DeleteImageAsync(product.PublicId);

             _context.Products.Remove(product);

             var result = await _context.SaveChangesAsync() > 0;

             if(result) return Ok();

             return BadRequest(new ProblemDetails { Title = "Problem deleting product"});

        }



    }
}