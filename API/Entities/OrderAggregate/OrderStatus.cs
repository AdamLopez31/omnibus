namespace API.Entities.OrderAggregate
{
    public enum OrderStatus
    {
        //ENUM: INSTEAD OF USING SOMETHING LIKE AN INTEGER TO REPRESENT A VALUE
        //WE CAN USE A RESTRICTED SET OF VALUES INSTEAD THAT ARE HUMAN READABLE
        Pending,
        PaymentReceived,
        PaymentFailed
    }
}