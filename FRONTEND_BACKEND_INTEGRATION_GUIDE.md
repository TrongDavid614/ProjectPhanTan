# 🔄 FE-Backend Order Integration - Implementation Guide

## ✅ Completed Frontend Changes

### 1. **Checkout Page (`src/app/page/checkout/page.js`)**

**Updated `handlePayment()` function to POST OrderCreateRequest to backend:**

```javascript
const handlePayment = async () => {
  // Validation logic...

  if (!hasError) {
    try {
      const userId = currentUser?.userId || currentUser?._id || "guest";

      // Build OrderCreateRequest
      const orderRequest = {
        userId,
        eventId: checkoutData.eventId,
        items: (checkoutData.items || []).map((item) => ({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
        })),
        voucherId: checkoutData.selectedVoucher?.voucherId || null,
        paymentMethod: "vnpay",
      };

      // POST to backend
      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(orderRequest),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.message || "Không thể tạo đơn hàng");
      }

      const orderId = responseData?.orderId || responseData?.data?.orderId;
      const paymentUrl =
        responseData?.paymentUrl || responseData?.data?.paymentUrl;

      if (!orderId) {
        throw new Error("API không trả về orderId");
      }

      // Store context and navigate to payment page
      const paymentContext = {
        orderId,
        userId,
        customer: { fullName, phone },
        eventId: checkoutData.eventId,
        eventName: checkoutData.eventName,
        items: checkoutData.items,
        subtotal: checkoutData.subtotal,
        discount: checkoutData.discount,
        total: checkoutData.total,
        selectedVoucher: checkoutData.selectedVoucher,
        paymentMethod: "vnpay",
        paymentUrl, // Store URL from backend if provided
        createdAt: new Date().toISOString(),
      };

      window.localStorage.setItem(
        "temp_payment_context",
        JSON.stringify(paymentContext),
      );
      router.push(`/page/payment?orderId=${orderId}`);
    } catch (err) {
      setPaymentError(err.message || "Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
    }
  }
};
```

**Key Changes:**

- ✅ Made function `async` to handle HTTP request
- ✅ Builds OrderCreateRequest with eventId, userId, items, voucherId
- ✅ POSTs to `/api/v1/orders` endpoint
- ✅ Receives orderId from backend (not generated locally)
- ✅ Optionally receives paymentUrl from backend
- ✅ Stores both in temp_payment_context for payment page

---

### 2. **Payment Page (`src/app/page/payment/page.js`)**

**Updated to use paymentUrl from backend if provided:**

```javascript
async function createPaymentLink() {
  try {
    setLoading(true);
    setError("");

    // Check if paymentUrl already provided from backend
    if (paymentContext?.paymentUrl) {
      if (!isMounted) return;
      setPaymentUrl(paymentContext.paymentUrl);
      setQrContent(paymentContext.paymentUrl);
      return;
    }

    // Fallback: call create-url endpoint if no paymentUrl provided
    const amount = Number(paymentContext.total || 0);
    // ... rest of API call logic
  }
}
```

**Key Changes:**

- ✅ Check if paymentUrl exists in paymentContext
- ✅ Use backend-provided URL directly if available
- ✅ Fall back to create-url endpoint if needed

---

## 📋 Backend Implementation Required

### **OrderController.java Template**

See `ORDER_CONTROLLER_TEMPLATE.java` in the workspace root for complete implementation.

**File Location in Backend:**

```
src/main/java/com/yourcompany/controller/OrderController.java
```

**What It Should Do:**

1. **Accept POST Request at `/api/v1/orders`**

   ```
   POST /api/v1/orders
   Content-Type: application/json

   Body: {
     "userId": "user_001",
     "eventId": "e_1234",
     "items": [
       { "ticketTypeId": "vip", "quantity": 2 },
       { "ticketTypeId": "standard", "quantity": 3 }
     ],
     "voucherId": "voucher_001"  // optional
   }
   ```

2. **Call OrderService.createOrderAndGetPaymentUrl()**
   - This service method already exists (from previous implementation)
   - It handles:
     - Creating Order entity with status="pending"
     - Creating OrderItem records
     - Validating ticket stock
     - Calculating total amount
     - Getting VNPAY payment URL
     - Saving to database

3. **Return Response with orderId & paymentUrl**
   ```json
   {
     "success": true,
     "orderId": "ORD_1234567890",
     "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
     "totalAmount": 500000
   }
   ```

---

## 🔄 Complete Payment Flow (End-to-End)

```
1. USER CHECKOUT PAGE
   ├─ Selects tickets, voucher, customer info
   ├─ Clicks "Thanh Toán" button
   └─ handlePayment() executes

2. FRONTEND POST /api/v1/orders
   ├─ Sends: eventId, userId, items[], voucherId
   ├─ Backend creates Order (status="pending")
   ├─ Backend generates VNPAY URL
   └─ Returns: orderId, paymentUrl, totalAmount

3. FRONTEND PAYMENT PAGE
   ├─ Loads temp_payment_context from localStorage
   ├─ Uses paymentUrl from backend to generate QR
   ├─ Displays QR code with countdown timer
   └─ User scans QR → VNPAY processes payment

4. VNPAY CALLBACK (/api/v1/payment/vnpay-return)
   ├─ VNPAY sends IPN with responseCode & vnp_TransactionNo
   ├─ Backend verifies HMAC signature
   ├─ If success (responseCode=="00"):
   │   ├─ Calls orderService.processSuccessfulPayment()
   │   ├─ Creates Payment record
   │   ├─ Generates Tickets (one per quantity)
   │   ├─ Increments TicketType.soldQuantity
   │   └─ Sets Order.status = "paid"
   └─ Returns success response

5. DATABASE STATE AFTER PAYMENT
   ├─ Order: status="paid", totalAmount=500000
   ├─ Payment: method=VNPAY, txnRef=vnpayTxnNo, status=success
   ├─ Tickets: 5 new tickets with QR codes (1:1 with ordered quantity)
   ├─ TicketType: soldQuantity += 5
   └─ User can view tickets in My Ticket page
```

---

## 🚨 Important Notes

### **Backend Validation**

The backend OrderController should validate:

- ✅ User exists (userId)
- ✅ Event exists (eventId)
- ✅ Each TicketType exists and matches eventId
- ✅ Sufficient stock available:
  ```java
  if (ticketType.getSoldQuantity() + item.quantity > ticketType.getTotalQuantity()) {
      throw new IllegalArgumentException("Không đủ vé cho " + ticketType.getName());
  }
  ```
- ✅ Voucher exists and is applicable (if provided)

### **Error Handling**

```
400 Bad Request:
- User not found
- Event not found
- Ticket type not found
- Insufficient stock
- Invalid voucher

500 Internal Server Error:
- Database connection error
- VNPAY API error
- Other unexpected errors
```

### **CORS Configuration**

Make sure CORS allows requests from frontend:

```java
@CrossOrigin(origins = "http://localhost:3000")
```

### **@Transactional**

Ensure createOrderAndGetPaymentUrl is wrapped with:

```java
@Transactional(rollbackFor = Exception.class)
```

---

## 🧪 Testing Checklist

### **Frontend:**

- [ ] Checkout form validates all fields before enabling button
- [ ] POST request to `/api/v1/orders` succeeds
- [ ] Response contains orderId and paymentUrl
- [ ] Payment context saved correctly to localStorage
- [ ] Navigation to payment page works
- [ ] QR code displays on payment page

### **Backend:**

- [ ] OrderController receives POST request
- [ ] Creates Order with status="pending"
- [ ] Creates OrderItems with correct quantities
- [ ] Validates stock before creating
- [ ] Returns proper response format
- [ ] Handles errors with appropriate HTTP status codes

### **End-to-End:**

- [ ] Create order from checkout
- [ ] Scan QR code in payment page
- [ ] Complete VNPAY payment
- [ ] Check database: Order, Payment, Tickets, sold_quantity all updated
- [ ] User can view tickets in My Ticket page

---

## 📝 Next Steps for User

1. **Copy OrderController template** to your backend project:
   - File: `ORDER_CONTROLLER_TEMPLATE.java`
   - Adjust package names and imports for your project

2. **Ensure OrderService.createOrderAndGetPaymentUrl() exists**
   - This method should handle order creation and payment URL generation
   - It must have @Transactional annotation

3. **Test the flow**:
   - Start backend server (port 8080)
   - Start frontend dev server (port 3000)
   - Go to checkout page
   - Select tickets, voucher, enter customer info
   - Click "Thanh Toán"
   - Should POST to backend and redirect to payment page

4. **Monitor logs** for any errors during POST request

---

## 📚 Related Files Modified

- ✅ `src/app/page/checkout/page.js` - Updated handlePayment()
- ✅ `src/app/page/payment/page.js` - Updated createPaymentLink()
- 📄 `ORDER_CONTROLLER_TEMPLATE.java` - New backend template

---

Generated: 2026-05-07
Status: Ready for backend implementation ✨
