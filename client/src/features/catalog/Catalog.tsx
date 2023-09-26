import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Product } from "../../app/models/product"

interface Props {
    products: Product[];
}


export default function Catalog({products}:Props) {
    return (
      <List>
        {products.map((product,index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar src={product.pictureUrl}></Avatar>
            </ListItemAvatar>
            <ListItemText>
              {product.name} - {product.price}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    )
}