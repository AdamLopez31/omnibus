using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    [Owned]
    public class ShippingAddress : Address
    {
        //ORDER OWNS THIS ENTITY DO NOT NEED TO GIVE ID PROPERTY
        
    }
}