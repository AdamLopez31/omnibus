using System.Text.Json;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
        public ProductsController(StoreContext context,IMapper mapper)
        {
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
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto) {

            var product = _mapper.Map<Product>(productDto);
            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            //CREATED AT ROUTE CREATING NEW RESOURCE ON THE SERVER 
            //CreatedAtRoute() parameters//route name/route value/object value:Product
            if(result) return CreatedAtRoute("GetProduct", new {Id = product.Id}, product);

            return BadRequest(new ProblemDetails{Title = "Problem creating new product"});

        }
    }
}