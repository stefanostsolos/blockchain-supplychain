# Script for importing products from an OFBIZ.INVENTORY_ITEM.json file
# Run in the main supplychain directory: python3 importproducts.py <json file> <producer id>
import json, os, time

def create_queries(json_file, producer_id):
    with open(json_file) as f:
        data = json.load(f)

    queries = []

    for item in data['data']:
        product_name = item['PRODUCT_ID']
        product_price = str(item['UNIT_COST'])
        query = f"docker exec cli peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C supplychainchannel -n dummycc6 -c '{{\"Args\":[\"createProduct\",\"{product_name}\",\"{producer_id}\",\"{product_price}\"]}}'"
        queries.append(query)

    return queries

def execute_queries(queries):
    for query in queries:
        os.system(query)
        time.sleep(3)

def main(json_file, producer_id):
    queries = create_queries(json_file, producer_id)
    execute_queries(queries)

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <json file> <producer id>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
