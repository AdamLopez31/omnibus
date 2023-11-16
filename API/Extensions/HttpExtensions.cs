using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.RequestHelpers;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        //ADDING HEADER TO HTTP RESPONSE
        public static void AddPaginationHeader(this HttpResponse response, MetaData metaData) {
            //JSON SERIALIZER options to specificy camel case
            var options = new JsonSerializerOptions {PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData,options));
            //WE WANT THIS CORS HEADER TO BE AVAILABLE IN OUR CLIENT BECAUSE THIS
            //IS A CUSTOM HEADER WE CREATED 
            response.Headers.Append("Access-Control-Expose-Headers","Pagination");
        }
    }
}