export const INITIAL_STATE = {
    userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
    title: "",
    cat: "",
    cover: "",
    images: [],
    desc: "",
    deliveryTime: 0,
    priceMin: 0,
    priceMax: 0,
    pages: 1,
    pricePerPage: 0,
    totalPrice: 0,
    discountEnabled: false,
    discountAmount: 0,
    discountCondition: "",
  };

  export const gigReducer=(state,action)=>{
    switch (action.type) {
        case "CHANGE_INPUT":
            return{
                ...state,
                [action.payload.name]:action.payload.value,
            };
           
        case "ADD_IMAGES":
            return{
                ...state,
                cover:action.payload.cover,
                images:action.payload.images,
            };

        default:
            return state;
    }
  }