import React, { Component } from "react";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditInventoryItemWrapper() {
    const { id } = useParams();
    return <EditInventoryItem id={id} />;
}

class EditInventoryItem extends Component {
    constructor(props) {
        super(props);

        // method binding
        this.onChangeProductName = this.onChangeProductName.bind(this);
        this.onChangeOwnerParty = this.onChangeOwnerParty.bind(this);
        this.onChangeFacilityID = this.onChangeFacilityID.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onChangeUnitCost = this.onChangeUnitCost.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            product_name: "",
            owner_party: "",
            facility_id: "",
            quantity: 1,
            unitcost: 0,
            initialProductName: "",
            initialOwnerParty: "",
            initialFacilityID: "",
            initialQuantity: 1,
            initialUnitCost: 0,
            itemHistory: [],
            date: {
                productionDate: new Date(),
                sendToManufacturerDate: new Date(),
                sendToDistributorDate: new Date(),
                sendToRetailerDate: new Date(),
                sellToConsumerDate: new Date(),
                orderedDate: new Date(),
                deliveredDate: new Date(),
                modifiedDate: new Date(),
            },
            producer_id: "",
            manufacturer_id: "",
            distributor_id: "",
            retailer_id: "",
            consumer_id: "",
            status: "",
            previousID: "",
            role: sessionStorage.getItem('role'),
            loggedUserId: sessionStorage.getItem('userId'),
        };
    }

    componentDidMount() {
        const headers = {
            "x-access-token": sessionStorage.getItem("jwtToken"),
        };
        axios.get("http://localhost:8090/product/inventory/items/get/" + this.props.id + "/" + this.state.role, { headers: headers })
            .then((response) => {
                console.log(response.data.data);
                console.log(response.data.data.InitialProductID);
                this.setState({
                    product_name: response.data.data.ProductNameID,
                    owner_party: response.data.data.OwnerPartyID,
                    facility_id: response.data.data.FacilityID,
                    quantity: response.data.data.QuantityOnHandTotal,
                    unitcost: response.data.data.UnitCost,
                    initialProductName: response.data.data.ProductNameID,
                    initialOwnerParty: response.data.data.OwnerPartyID,
                    initialFacilityID: response.data.data.FacilityID,
                    initialQuantity: response.data.data.Quantity,
                    initialUnitCost: response.data.data.UnitCost,
                    initialInventoryItemID: response.data.data.InitialInventoryItemID,
                }, () => {
                    // Fetch inventory item history inside the callback function of setState, this will ensure that the state has been updated before this code runs
                    const requestData = {
                        id: this.props.id,
                        loggedUserId: this.state.loggedUserId,
                        initialInventoryItemID: this.state.initialInventoryItemID,
                    };

                    axios.post("http://localhost:8090/product/history/of/all/inventory/items/" + this.state.role + "/" + this.props.id, requestData, { headers: headers })
                        .then((response) => {
                            console.log(response.data.data);
                            this.setState({ itemHistory: response.data.data });
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            })
            .catch((error) => {
                // handle error
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    }

    onSubmit(e) {
        e.preventDefault();
        console.log('Inventory Item id:', this.props.id);
        console.log('Logged user id:', sessionStorage.getItem('userId'));

        const inventoryitem = {
            inventory_item_id: this.props.id,
            loggedUserId: sessionStorage.getItem('userId'),
            name: this.state.product_name,
            ownerparty: this.state.owner_party,
            facilityid: this.state.facility_id,
            quantity: this.state.quantity,
            unitcost: this.state.unitcost,
        };
        console.log(inventoryitem.inventory_item_id);
        console.log(inventoryitem);

        const headers = {
            "x-access-token": sessionStorage.getItem("jwtToken"),
        };

        axios.put("http://localhost:8090/product/inventoryitem/" + this.props.id + "/" + this.state.role, inventoryitem, { headers: headers })
            .then((res) => {
                console.log(res.data);
                toast.success(`Updated inventory item successfully.`, {
                    position: toast.POSITION.TOP_CENTER,
                    onClose: () => {
                        window.location = "/inventoryitems";
                    }
                });
            })
            .catch((error) => {
                console.error(error);
                toast.error("An error occurred while updating the inventory item.");
            });
    }

    onChangeProductName(e) {
        this.setState({
            product_name: e.target.value,
        });
    }

    onChangeOwnerParty(e) {
        this.setState({
            owner_party: e.target.value,
        });
    }

    onChangeFacilityID(e) {
        this.setState({
            facility_id: e.target.value,
        });
    }

    onChangeQuantity(e) {
        this.setState({
            quantity: Number(e.target.value),
        });
    }

    onChangeUnitCost(e) {
        this.setState({
            unitcost: e.target.value,
        });
    }

    compareHistoryItems(previousItem, currentItem) {
        return {
            ProductName: previousItem.ProductName !== currentItem.ProductName,
            OwnerPartyID: previousItem.OwnerPartyID !== currentItem.OwnerPartyID,
            FacilityID: previousItem.FacilityID !== currentItem.FacilityID,
            Quantity: previousItem.Quantity !== currentItem.Quantity,
            UnitCost: previousItem.UnitCost !== currentItem.UnitCost,
        };
    }

    render() {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <h3>Update Inventory Item</h3>
                <form onSubmit={this.onSubmit} style={{ maxWidth: "300px" }}>
                    <div className="form-group">
                        <label className={this.state.internal_name !== this.state.initialInternalName ? "text-success" : ""}>InternalName: </label>
                        <input
                            type="text"
                            required
                            className={`form-control ${this.state.internal_name !== this.state.initialInternalName ? "text-success" : ""}`}
                            value={this.state.internal_name}
                            onChange={this.onChangeInternalName}
                        />
                    </div>
                    <div className="form-group">
                        <label className={this.state.description !== this.state.initialDescription ? "text-success" : ""}>Description: </label>
                        <input
                            type="text"
                            required
                            className={`form-control ${this.state.description !== this.state.initialDescription ? "text-success" : ""}`}
                            value={this.state.description}
                            onChange={this.onChangeDescription}
                        />
                    </div>
                    <div className="form-group">
                        <label className={this.state.quantity !== this.state.initialQuantity ? "text-success" : ""}>Quantity: </label>
                        <input
                            type="text"
                            className={`form-control ${this.state.quantity !== this.state.initialQuantity ? "text-success" : ""}`}
                            value={this.state.quantity}
                            onChange={this.onChangeQuantity}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="submit"
                            value="Update Inventory Item"
                            className="btn btn-primary"
                            disabled={this.state.internal_name === this.state.initialInternalName && this.state.description == this.state.initialDescription && this.state.quantity === this.state.initialQuantity}
                        />
                    </div>
                </form>
                <ToastContainer autoClose={2000} theme="dark" />

                <h3>Inventory Item History</h3>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
                    {this.state.itemHistory.map((historyItem, index) => {
                        const changes = index > 0 ? this.compareHistoryItems(this.state.itemHistory[index - 1], historyItem) : {};
                        return (
                            <div
                                className="card bg-dark text-white m-2"
                                key={index}
                                style={index === this.state.itemHistory.length - 1 ? { borderColor: "green", borderWidth: "2px" } : {}}
                            >
                                <div className="card-body">
                                    <h5 className="card-title">{index === this.state.itemHistory.length - 1 ? 'Latest Version' : `Version ${index + 1}`}</h5>
                                    <p className="card-text">ProductID: {historyItem.ProductID}</p>
                                    <p className={`card-text ${changes.ProductName ? "text-success" : ""}`}>ProductName: {historyItem.ProductNameID}</p>
                                    <p className={`card-text ${changes.InternalName ? "text-success" : ""}`}>InternalName: {historyItem.InternalName}</p>
                                    <p className={`card-text ${changes.Description ? "text-success" : ""}`}>Description: {historyItem.Description}</p>
                                    <p className={`card-text ${changes.Quantity ? "text-success" : ""}`}>Quantity: {historyItem.Quantity}</p>
                                    <p className="card-text">Status: {historyItem.Status}</p>
                                    <p className="card-text">{index === 0 ? 'Imported Date' : 'Modified Date'}: {index === 0 ? historyItem.Date.ProductionDate : historyItem.LastUpdatedStamp}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default EditInventoryItemWrapper;