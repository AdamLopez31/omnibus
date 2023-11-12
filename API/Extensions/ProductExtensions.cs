using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
            //DEFAULT IF ORDERBY IS NOT AVAILABLE
            if(string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);
            query = orderBy switch
            {
                //BUILD UP EXPRESSION TREE
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                //_default case
                _ => query.OrderBy(p => p.Name)

            };
            return query;
        }

                                            //Search(this IQueryable<Product> query, string orderBy) thing 
                                            //were going to be expanding
         public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if(string.IsNullOrWhiteSpace(searchTerm)) return query;
            var lowerCaseSearch = searchTerm.Trim().ToLower();
            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearch));
           
        }

        //PARAMETER IS COMMA SEPARATED LIST OF STRINGS
         public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
            var brandList = new List<string>();
            var typeList = new List<string>();

            //IF STRING IS NOT NULL OR EMPTY
            if(!string.IsNullOrEmpty(brands))
                brandList.AddRange(brands.ToLower().Split(",").ToList());
            if(!string.IsNullOrEmpty(types))
                typeList.AddRange(types.ToLower().Split(",").ToList());
            query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));

            return query;
        }
    }
}