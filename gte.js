const mysql = require('mysql2/promise');
const { inherits } = require('util');

async function runQueries() {
  const connection = await mysql.createConnection({
    host: 'your-database-host',
    user: 'your-database-user',
    database: 'your-database-name',
    password: 'your-database-password'
  });

  try {
    // Display all the data of customers
    const customersQuery = 'SELECT * FROM customers';
    const [customers] = await connection.query(customersQuery);
    console.log('Customers:', customers);

    // Display the product_name and category for products which their price is between 5000 and 10000
    const productsQuery = 'SELECT product_name, category FROM products WHERE price BETWEEN 5000 AND 10000';
    const [products] = await connection.query(productsQuery);
    console.log('Products:', products);

    // Display all the data of products sorted in descending order of price
    const sortedProductsQuery = 'SELECT * FROM products ORDER BY price DESC';
    const [sortedProducts] = await connection.query(sortedProductsQuery);
    console.log('Sorted Products:', sortedProducts);

    // Display the total number of orders, the average amount, the highest total amount, and the lowest total amount
    const ordersSummaryQuery = 'SELECT COUNT(order_id) AS total_orders, AVG(amount) AS average_amount, MAX(amount) AS highest_amount, MIN(amount) AS lowest_amount FROM orders';
    const [ordersSummary] = await connection.query(ordersSummaryQuery);
    console.log('Orders Summary:', ordersSummary);

    // For each product_id, display the number of orders
    const ordersByProductQuery = 'SELECT product_id, COUNT(order_id) AS num_orders FROM orders GROUP BY product_id';
    const [ordersByProduct] = await connection.query(ordersByProductQuery);
    console.log('Orders by Product:', ordersByProduct);

    // Display the customer_id which has more than 2 orders
    const customersWithMultipleOrdersQuery = 'SELECT customer_id, COUNT(order_id) AS num_orders FROM orders GROUP BY customer_id HAVING COUNT(order_id) > 2';
    const [customersWithMultipleOrders] = await connection.query(customersWithMultipleOrdersQuery);
    console.log('Customers with more than 2 orders:', customersWithMultipleOrders);

    // For each month of the 2020 year, display the number of orders
    const ordersByMonthQuery = 'SELECT EXTRACT(MONTH FROM order_date) AS month, COUNT(order_id) AS num_orders FROM orders WHERE EXTRACT(YEAR FROM order_date) = 2020 GROUP BY EXTRACT(MONTH FROM order_date)';
    const [ordersByMonth] = await connection.query(ordersByMonthQuery)
    console.log('Orders by Month in 2020:', ordersByMonth);

    // For each order, display the product_name, the customer_name, and the date of the order
    const orderDetailsQuery = 'SELECT p.product_name, c.customer_name, o.order_date FROM orders o JOIN products p ON o.product_id = p.product_id JOIN customers c ON o.customer_id = c.customer_id';
    const [orderDetails] = await connection.query(orderDetailsQuery);
    console.log('Order Details:', orderDetails);

    // Display all the orders made three months ago
    const threeMonthsAgoQuery = 'SELECT * FROM orders WHERE order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH) AND order_date < DATE_SUB(CURRENT_DATE, INTERVAL 2 MONTH)';
    const [threeMonthsAgoOrders] = await connection.query(threeMonthsAgoQuery);
    console.log('Orders made three months ago:', threeMonthsAgoOrders);

    // Display customers (customer_id) who have never ordered a product
    const customersWithoutOrdersQuery = 'SELECT customer_id FROM customers WHERE customer_id NOT IN (SELECT DISTINCT customer_id FROM orders)';
    const [customersWithoutOrders] = await connection.query(customersWithoutOrdersQuery);
    console.log('Customers without orders:', customersWithoutOrders);
  } catch (error) {
    console.error('Error executing queries:', error);
  } finally {
    await connection.end();
  }
}

runQueries();