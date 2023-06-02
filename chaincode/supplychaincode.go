package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type s_supplychain struct {
}

type CounterNO struct {
	Counter int `json:"counter"`
}

type User struct {
	Name      string `json:"Name"`
	User_ID   string `json:"UserID"`
	Email     string `json:"Email"`
	User_Type string `json:"UserType"`
	Address   string `json:"Address"`
	Password  string `json:"Password"`
}

type ProductDates struct {
	ProductionDate       string `json:"ProductionDate"`
	SendToManufacturerDate  string `json:"SendToManufacturerDate"`
	SendToDistributorDate string `json:"SendToDistributorDate"`
	SendToRetailerDate    string `json:"SendToRetailerDate"`
	SellToConsumerDate    string `json:"SellToConsumerDate"`
	OrderedDate           string `json:"OrderedDate"`
	DeliveredDate         string `json:"DeliveredDate"`
}

type Product struct {
	Product_ID      string       `json:"ProductID"`
	Order_ID        string       `json:"OrderID"`
	Name            string       `json:"Name"`
	Consumer_ID     string       `json:"ConsumerID"`
	Manufacturer_ID string       `json:"ManufacturerID"`
	Retailer_ID     string       `json:"RetailerID"`
	Distributor_ID  string       `json:"DistributorID"`
	Producer_ID   string       `json:"ProducerID"`
	Status          string       `json:"Status"`
	Date            ProductDates `json:"Date"`
	Price           float64      `json:"Price"`
}

// =================================================================================== // Main // ===================================================================================

func main() {
	err := shim.Start(new(s_supplychain))
	if err != nil {
		fmt.Printf("Error starting chaincode: %s", err)
	}
}

// Init initializes chaincode // ===========================

func (t *s_supplychain) Init(APIstub shim.ChaincodeStubInterface) pb.Response {

	// Initializing Product Counter
	ProductCounterBytes, _ := APIstub.GetState("ProductCounterNO")
	if ProductCounterBytes == nil {
		var ProductCounter = CounterNO{Counter: 0}
		ProductCounterBytes, _ := json.Marshal(ProductCounter)
		err := APIstub.PutState("ProductCounterNO", ProductCounterBytes)
		if err != nil {
			return shim.Error(fmt.Sprintf("Failed to initiate Product Counter"))
		}
	}
	// Initializing Order Counter
	OrderCounterBytes, _ := APIstub.GetState("OrderCounterNO")
	if OrderCounterBytes == nil {
		var OrderCounter = CounterNO{Counter: 0}
		OrderCounterBytes, _ := json.Marshal(OrderCounter)
		err := APIstub.PutState("OrderCounterNO", OrderCounterBytes)
		if err != nil {
			return shim.Error(fmt.Sprintf("Failed to initiate Order Counter"))
		}
	}
	// Initializing User Counter
	UserCounterBytes, _ := APIstub.GetState("UserCounterNO")
	if UserCounterBytes == nil {
		var UserCounter = CounterNO{Counter: 0}
		UserCounterBytes, _ := json.Marshal(UserCounter)
		err := APIstub.PutState("UserCounterNO", UserCounterBytes)
		if err != nil {
			return shim.Error(fmt.Sprintf("Failed to initiate User Counter"))
		}
	}

	return shim.Success(nil)
}

// Invoke - Our entry point for Invocations // ========================================

func (t *s_supplychain) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "initLedger" {
		//init ledger
		return t.initLedger(stub, args)
	} else if function == "signIn" {
		//login user
		return t.signIn(stub, args)
	} else if function == "createUser" {
		//create a new user
		return t.createUser(stub, args)
	} else if function == "createProduct" {
		//create a new product
		return t.createProduct(stub, args)
	} else if function == "updateProduct" {
		// update a product
		return t.updateProduct(stub, args)
	} else if function == "orderProduct" {
		// order a product
		return t.orderProduct(stub, args)
	} else if function == "deliverProduct" {
		// order a product
		return t.deliverProduct(stub, args)
	} else if function == "sendToManufacturer" {
		// send to Manufacturer
		return t.sendToManufacturer(stub, args)
	} else if function == "sendToDistributor" {
		// send to Distributor
		return t.sendToDistributor(stub, args)
	} else if function == "sendToRetailer" {
		// send to Retailer
		return t.sendToRetailer(stub, args)
	} else if function == "sellToConsumer" {
		// send to Consumer
		return t.sellToConsumer(stub, args)
	} else if function == "queryAsset" {
		// query any using asset-id
		return t.queryAsset(stub, args)
	} else if function == "queryAll" {
		// query all assests of a type
		return t.queryAll(stub, args)
	}
	fmt.Println("invoke could not find func: " + function)
	//error
	return shim.Error("Received unknown function invocation")
}

// Private function

//getCounter to the latest value of the counter based on the Asset Type provided as input parameter
func getCounter(APIstub shim.ChaincodeStubInterface, AssetType string) int {
	counterAsBytes, _ := APIstub.GetState(AssetType)
	counterAsset := CounterNO{}

	json.Unmarshal(counterAsBytes, &counterAsset)
	fmt.Sprintf("Counter current value %d of asset type %s", counterAsset.Counter, AssetType)

	return counterAsset.Counter
}

//incrementCounter to the increase value of the counter based on the Asset Type provided as input parameter by 1
func incrementCounter(APIstub shim.ChaincodeStubInterface, AssetType string) int {
	counterAsBytes, _ := APIstub.GetState(AssetType)
	counterAsset := CounterNO{}

	json.Unmarshal(counterAsBytes, &counterAsset)
	counterAsset.Counter++
	counterAsBytes, _ = json.Marshal(counterAsset)

	err := APIstub.PutState(AssetType, counterAsBytes)
	if err != nil {
		fmt.Sprintf("Failed to increment counter")
	}
	fmt.Println("Success in incrementing counter  %v", counterAsset)

	return counterAsset.Counter
}

// GetTxTimestampChannel Function gets the Transaction time when the chain code was executed it remains same on all the peers where chaincode executes
func (t *s_supplychain) GetTxTimestampChannel(APIstub shim.ChaincodeStubInterface) (string, error) {
	txTimeAsPtr, err := APIstub.GetTxTimestamp()
	if err != nil {
		fmt.Printf("Returning error in timestamp \n")
		return "Error", err
	}
	fmt.Printf("\t returned value from APIstub: %v\n", txTimeAsPtr)
	timeStr := time.Unix(txTimeAsPtr.Seconds, int64(txTimeAsPtr.Nanos)).String()

	return timeStr, nil
}

func (t *s_supplychain) initLedger(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {
	// seed admin
	entityUser := User{Name: "admin", User_ID: "admin", Email: "admin@pg.com", User_Type: "admin", Address: "athens", Password: "adminpw"}
	entityUserAsBytes, errMarshal := json.Marshal(entityUser)

	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error in user: %s", errMarshal))
	}

	errPut := APIstub.PutState(entityUser.User_ID, entityUserAsBytes)

	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", entityUser.User_ID))
	}

	fmt.Println("Added", entityUser)

	return shim.Success(nil)
}

//sign in
func (t *s_supplychain) signIn(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments, expected 2 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("User ID must be provided")
	}

	if len(args[1]) == 0 {
		return shim.Error("Password must be provided")
	}

	entityUserBytes, _ := APIstub.GetState(args[0])
	if entityUserBytes == nil {
		return shim.Error("Cannot find Entity")
	}
	entityUser := User{}
	// unmarshalling the entity data
	json.Unmarshal(entityUserBytes, &entityUser)

	// check if password matched
	if entityUser.Password != args[1] {
		return shim.Error("User ID or password is wrong")
	}

	return shim.Success(entityUserBytes)
}

//create user
func (t *s_supplychain) createUser(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments, expected 5 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Name must be provided to register user")
	}

	if len(args[1]) == 0 {
		return shim.Error("Email must be non-empty")
	}

	if len(args[2]) == 0 {
		return shim.Error("User type must be specified")
	}

	if len(args[3]) == 0 {
		return shim.Error("Address must be non-empty ")
	}

	if len(args[4]) == 0 {
		return shim.Error("Password must be non-empty ")
	}

	userCounter := getCounter(APIstub, "UserCounterNO")
	userCounter++

	var comAsset = User{Name: args[0], User_ID: "User" + strconv.Itoa(userCounter), Email: args[1], User_Type: args[2], Address: args[3], Password: args[4]}

	comAssetAsBytes, errMarshal := json.Marshal(comAsset)

	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error in Product: %s", errMarshal))
	}

	errPut := APIstub.PutState(comAsset.User_ID, comAssetAsBytes)

	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to register user: %s", comAsset.User_ID))
	}

	//TO Increment the User Counter
	incrementCounter(APIstub, "UserCounterNO")

	fmt.Println("User was registered successfully %v", comAsset)

	return shim.Success(comAssetAsBytes)

}

func (t *s_supplychain) createProduct(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	//To check number of arguments are 3
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments, expected 3 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Name must be provided to create a product")
	}

	if len(args[1]) == 0 {
		return shim.Error("Producer_ID must be provided")
	}

	if len(args[2]) == 0 {
		return shim.Error("Price must be non-empty")
	}
	// get user details from the stub ie. Chaincode stub in network using the user id passed
	userBytes, _ := APIstub.GetState(args[1])

	if userBytes == nil {
		return shim.Error("Cannot find user")
	}

	user := User{}

	// unmarshalling product the data from API
	json.Unmarshal(userBytes, &user)

	// User type check for the function
	if user.User_Type != "producer" {
		return shim.Error("User type must be producer")
	}

	//Price conversion - Error handling
	i1, errPrice := strconv.ParseFloat(args[2], 64)
	if errPrice != nil {
		return shim.Error(fmt.Sprintf("Failed to Convert Price: %s", errPrice))
	}

	productCounter := getCounter(APIstub, "ProductCounterNO")
	productCounter++

	//To get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in transaction timestamp")
	}

	// DATES
	dates := ProductDates{}
	// json.Unmarshal(product.Date, &dates)

	dates.ProductionDate = txTimeAsPtr

	var comAsset = Product{Product_ID: "Product" + strconv.Itoa(productCounter), Order_ID: "", Name: args[0], Consumer_ID: "", Producer_ID: args[1], Manufacturer_ID: "", Retailer_ID: "", Distributor_ID: "", Status: "Available", Date: dates, Price: i1}

	comAssetAsBytes, errMarshal := json.Marshal(comAsset)

	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error in Product: %s", errMarshal))
	}

	errPut := APIstub.PutState(comAsset.Product_ID, comAssetAsBytes)

	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to create Product Asset: %s", comAsset.Product_ID))
	}

	//To Increment the Product Counter
	incrementCounter(APIstub, "ProductCounterNO")

	fmt.Println("Success in creating Product Asset %v", comAsset)

	return shim.Success(comAssetAsBytes)
}

// function to update the product name and price
// Input params : product id , user id , product name , product price
func (t *s_supplychain) updateProduct(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	// parameter length check
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments, expected 4 arguments")
	}

	// parameter null check
	if len(args[0]) == 0 {
		return shim.Error("Product Id must be provided")
	}

	if len(args[1]) == 0 {
		return shim.Error("User Id must be provided")
	}

	if len(args[2]) == 0 {
		return shim.Error("Product Name must be provided")
	}

	if len(args[3]) == 0 {
		return shim.Error("Product Price must be provided")
	}

	// get user details from the stub ie. Chaincode stub in network using the user id passed
	userBytes, _ := APIstub.GetState(args[1])

	if userBytes == nil {
		return shim.Error("Cannot find User")
	}

	user := User{}

	// unmarshalling product the data from API
	json.Unmarshal(userBytes, &user)

	// User type check for the function
	if user.User_Type == "consumer" {
		return shim.Error("User type cannot be Consumer")
	}

	// get product details from the stub ie. Chaincode stub in network using the product id passed
	productBytes, _ := APIstub.GetState(args[0])
	if productBytes == nil {
		return shim.Error("Cannot find Product")
	}
	product := Product{}

	// unmarshalling product the data from API
	json.Unmarshal(productBytes, &product)

	//Price conversion - Error handling
	i1, errPrice := strconv.ParseFloat(args[3], 64)
	if errPrice != nil {
		return shim.Error(fmt.Sprintf("Failed to Convert Price: %s", errPrice))
	}

	// Updating the product values withe the new values
	product.Name = args[2] // product name from UI for the update
	product.Price = i1     // product value from UI for the update

	updatedProductAsBytes, errMarshal := json.Marshal(product)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut := APIstub.PutState(product.Product_ID, updatedProductAsBytes)
	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to update product: %s", product.Product_ID))
	}

	fmt.Println("Success in updating Product %v ", product.Product_ID)
	return shim.Success(updatedProductAsBytes)
}

func (t *s_supplychain) orderProduct(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {
	// parameter length check
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments, expected 2 arguments")
	}

	// parameter null check
	if len(args[0]) == 0 {
		return shim.Error("Consumer Id must be provided")
	}

	if len(args[1]) == 0 {
		return shim.Error("Product Id must be provided")
	}

	userBytes, _ := APIstub.GetState(args[0])

	if userBytes == nil {
		return shim.Error("Cannot find Consumer")
	}

	user := User{}

	// unmarshalling product the data from API
	json.Unmarshal(userBytes, &user)

	// User type check for the function
	if user.User_Type != "consumer" {
		return shim.Error("User type must be Consumer")
	}

	productBytes, _ := APIstub.GetState(args[1])
	if productBytes == nil {
		return shim.Error("Cannot find Product")
	}
	product := Product{}

	// unmarshalling product the data from API
	json.Unmarshal(productBytes, &product)

	orderCounter := getCounter(APIstub, "OrderCounterNO")
	orderCounter++

	//To get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in transaction timestamp")
	}

	product.Order_ID = "Order" + strconv.Itoa(orderCounter)
	product.Consumer_ID = user.User_ID
	product.Status = "Ordered"
	product.Date.OrderedDate = txTimeAsPtr

	updatedProductAsBytes, errMarshal := json.Marshal(product)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	incrementCounter(APIstub, "OrderCounterNO")

	errPut := APIstub.PutState(product.Product_ID, updatedProductAsBytes)
	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to place the order : %s", product.Product_ID))
	}

	fmt.Println("Order was placed successfully %v ", product.Product_ID)
	return shim.Success(updatedProductAsBytes)
}

func (t *s_supplychain) deliverProduct(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {
	// parameter length check
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments, expected 1 argument")
	}

	if len(args[0]) == 0 {
		return shim.Error("Product Id must be provided")
	}

	productBytes, _ := APIstub.GetState(args[0])
	if productBytes == nil {
		return shim.Error("Cannot find Product")
	}
	product := Product{}

	// unmarshalling product the data from API
	json.Unmarshal(productBytes, &product)

	if product.Status != "Sold" {
		return shim.Error("Product is not delivered yet")
	}

	//To get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in transaction timestamp")
	}

	product.Date.DeliveredDate = txTimeAsPtr
	product.Status = "Delivered"
	updatedProductAsBytes, errMarshal := json.Marshal(product)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut := APIstub.PutState(product.Product_ID, updatedProductAsBytes)
	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to update that product is delivered: %s", product.Product_ID))
	}

	fmt.Println("Success in delivering Product %v ", product.Product_ID)
	return shim.Success(updatedProductAsBytes)

}

// send to Manufacturer
func (t *s_supplychain) sendToManufacturer(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments, expected 2 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Product Id must be provided")
	}

	if len(args[1]) == 0 {
		return shim.Error("Manufacturer Id must be provided")
	}

	userBytes, _ := APIstub.GetState(args[1])

	if userBytes == nil {
		return shim.Error("Cannot find Manufacturer user")
	}

	user := User{}

	json.Unmarshal(userBytes, &user)

	if user.User_Type != "manufacturer" {
		return shim.Error("User type must be Manufacturer")
	}

	productBytes, _ := APIstub.GetState(args[0])

	if productBytes == nil {
		return shim.Error("Cannot find Product")
	}

	product := Product{}

	json.Unmarshal(productBytes, &product)

	if product.Manufacturer_ID != "" {
		return shim.Error("Product is sent to Manufacturer already")
	}

	//To get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in transaction timestamp")
	}

	product.Manufacturer_ID = user.User_ID
	product.Date.SendToManufacturerDate = txTimeAsPtr
	updatedProductAsBytes, errMarshal := json.Marshal(product)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut := APIstub.PutState(product.Product_ID, updatedProductAsBytes)
	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to send to Manufacturer: %s", product.Product_ID))
	}

	fmt.Println("Success in sending Product %v ", product.Product_ID)
	return shim.Success(updatedProductAsBytes)
}

// send to distributor
func (t *s_supplychain) sendToDistributor(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments, expected 2 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Product Id must be provided")
	}

	if len(args[1]) == 0 {
		return shim.Error("Distributor Id must be provided")
	}

	userBytes, _ := APIstub.GetState(args[1])

	if userBytes == nil {
		return shim.Error("Cannot find Distributor user")
	}

	user := User{}

	json.Unmarshal(userBytes, &user)

	if user.User_Type != "distributor" {
		return shim.Error("User type must be distributor")
	}

	productBytes, _ := APIstub.GetState(args[0])

	if productBytes == nil {
		return shim.Error("Cannot find Product")
	}

	product := Product{}

	json.Unmarshal(productBytes, &product)

	if product.Distributor_ID != "" {
		return shim.Error("Product is sent to distributor already")
	}

	//To get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in transaction timestamp")
	}

	product.Distributor_ID = user.User_ID
	product.Date.SendToDistributorDate = txTimeAsPtr
	updatedProductAsBytes, errMarshal := json.Marshal(product)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut := APIstub.PutState(product.Product_ID, updatedProductAsBytes)
	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to send to Distributor: %s", product.Product_ID))
	}

	fmt.Println("Success in sending Product %v ", product.Product_ID)
	return shim.Success(updatedProductAsBytes)
}

// send to retailer
func (t *s_supplychain) sendToRetailer(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments, expected 2 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Product Id must be specified")
	}

	if len(args[1]) == 0 {
		return shim.Error("Retailer Id must be specified")
	}

	userBytes, _ := APIstub.GetState(args[1])
	if userBytes == nil {
		return shim.Error("Could not find the retailer")
	}

	user := User{}
	json.Unmarshal(userBytes, &user)
	if user.User_Type != "retailer" {
		return shim.Error("User must be a retailer")
	}

	productBytes, _ := APIstub.GetState(args[0])
	if productBytes == nil {
		return shim.Error("Could not find the product")
	}

	product := Product{}
	json.Unmarshal(productBytes, &product)
	if product.Retailer_ID != "" {
		return shim.Error("Product has already been sent to retailer")
	}

	//To get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in transaction timestamp")
	}

	product.Retailer_ID = user.User_ID
	product.Date.SendToRetailerDate = txTimeAsPtr
	updatedProductAsBytes, errMarshal := json.Marshal(product)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal error: %s", errMarshal))
	}

	errPut := APIstub.PutState(product.Product_ID, updatedProductAsBytes)
	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to send to retailer: %s", product.Product_ID))
	}

	fmt.Println("Sent product %v to retailer successfully", product.Product_ID)
	return shim.Success(updatedProductAsBytes)
}

// function to sell the product to consumer
// Input params , product id  consumer id
func (t *s_supplychain) sellToConsumer(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	// parameter length check
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments, expected 1 argument")
	}

	// parameter null check
	if len(args[0]) == 0 {
		return shim.Error("Product Id must be provided")
	}

	// get product details from the stub ie. Chaincode stub in network using the product id passed
	productBytes, _ := APIstub.GetState(args[0])

	if productBytes == nil {
		return shim.Error("Cannot find Product")
	}

	product := Product{}

	// unmarshalling product the data from API
	json.Unmarshal(productBytes, &product)

	// check if the product is ordered or not
	if product.Order_ID == "" {
		return shim.Error("Product has not been ordered yet")
	}

	// check if the product is sold to consumer already
	if product.Consumer_ID == "" {
		return shim.Error("Customer Id should be set to sell to customer")
	}

	//To get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in transaction timestamp")
	}

	// Updating the product values to be updated after the function
	product.Date.SellToConsumerDate = txTimeAsPtr
	product.Status = "Sold"
	updatedProductAsBytes, errMarshal := json.Marshal(product)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut := APIstub.PutState(product.Product_ID, updatedProductAsBytes)
	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to sell To Consumer: %s", product.Product_ID))
	}

	fmt.Println("Success in sending Product %v ", product.Product_ID)
	return shim.Success(updatedProductAsBytes)
}

//queryAsset
func (t *s_supplychain) queryAsset(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments, expected 1 argument")
	}

	productAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(productAsBytes)
}

// query all asset of a type
func (t *s_supplychain) queryAll(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments, expected 1 argument")
	}

	// parameter null check
	if len(args[0]) == 0 {
		return shim.Error("Asset type must be provided")
	}

	assetType := args[0]
	assetCounter := getCounter(APIstub, assetType+"CounterNO")

	startKey := assetType + "1"
	endKey := assetType + strconv.Itoa(assetCounter+1)

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)

	if err != nil {
		return shim.Error(err.Error())
	}

	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults

	var buffer bytes.Buffer

	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false

	for resultsIterator.HasNext() {

		queryResponse, err := resultsIterator.Next()
		// respValue := string(queryResponse.Value)
		if err != nil {
			return shim.Error(err.Error())
		}

		// Add a comma before array members, suppress it for the first array member

		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}

		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")
		buffer.WriteString(", \"Record\":")

		// Record is a JSON object, so we write as-is

		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true

	}

	buffer.WriteString("]")

	fmt.Printf("- queryAllAssets:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}