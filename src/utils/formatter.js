import moment from "moment";

export const displayDate = (date, format = "Y-MM-DD") => {
  if (date) {
    let isObj = typeof date === 'object' && date !== null;
    if (isObj && "_seconds" in date) {
      let tmp = new Date(date._seconds * 1000);
      return moment(`${tmp.toDateString()} ${tmp.toLocaleTimeString()}`).format(format);
    } else {
      return moment(date).format(format);
    }
  }

  return '';
}

export const toPriceFormat = (item) => {
  return item.toLocaleString("en-US", {
    style: "currency",
    currency: "PHP"
  });
}

export const getStatusLabel = (status) => {
  let options = {
    "new_order": "New Order",
    "rider_accepted": "Rider Accepted",
    "merchant_accepted": "Merchant Accepted",
    "on_transit": "On Transit",
    "delivered": "Delivered",
    "cancelled": "Cancelled",
    "closed": "Closed",
  }

  return options[status];
}

export const getSingleStatusLabel = (status) => {
  let options = {
    "new_order": "New Order",
    "rider_picked_up": "Picked Up by Rider",
    "merchant_accepted": "Merchant Accepted",
    "cancelled": "Cancelled",
  }

  return options[status];
}

export const getStatusTimeField = (status) => {
  let options = {
    "rider_accepted": "riderAcceptedAt",
    "merchant_accepted": "merchantAcceptedAt",
    "on_transit": "onTransitAt",
    "delivered": "deliveredAt",
    "cancelled": "cancelledAt",
    "closed": "closedAt",
  }

  return options[status];
}