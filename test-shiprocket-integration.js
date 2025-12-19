import { getPickupLocations, getCouriers } from "./lib/logistics/shiprocket";
async function testShiprocketIntegration() {
    console.log("Testing Shiprocket integration...");
    try {
        // Test authentication
        console.log("1. Testing authentication...");
        const email = process.env.SHIPROCKET_EMAIL;
        const password = process.env.SHIPROCKET_PASSWORD;
        if (!email || !password) {
            console.log("❌ Missing SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD environment variables");
            return;
        }
        console.log("✅ Environment variables found");
        // Test getting pickup locations
        console.log("2. Testing pickup locations API...");
        const pickupLocations = await getPickupLocations();
        console.log("✅ Pickup locations fetched successfully");
        console.log(`   Found ${pickupLocations.data?.length || 0} pickup locations`);
        // Test getting couriers
        console.log("3. Testing couriers API...");
        const couriers = await getCouriers();
        console.log("✅ Couriers fetched successfully");
        console.log(`   Found ${couriers.data?.length || 0} couriers`);
        console.log("🎉 All Shiprocket integration tests passed!");
    }
    catch (error) {
        console.error("❌ Shiprocket integration test failed:", error.message);
        console.error("Full error:", error);
    }
}
testShiprocketIntegration();
