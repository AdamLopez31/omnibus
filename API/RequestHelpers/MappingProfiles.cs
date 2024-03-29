using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using AutoMapper;


namespace API.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //WHERE ARE WE GOING TO GO FROM - WHERE ARE WE GOING TO GO TO
            CreateMap<CreateProductDto, Product>();

            CreateMap<UpdateProductDto, Product>();
  
        }
    }   
}