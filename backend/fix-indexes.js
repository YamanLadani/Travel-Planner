import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';

async function fixIndexes() {
    const client = await MongoClient.connect(uri);
    const db = client.db('travel-planner');
    const collection = db.collection('users');

    // Show current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));

    // Drop the stale email_1 index if it exists
    try {
        await collection.dropIndex('email_1');
        console.log('✓ Dropped stale email_1 index');
    } catch (e) {
        console.log('email_1 index not found or already dropped:', e.message);
    }

    // Remove explicit null email fields so sparse index works correctly
    const result = await collection.updateMany(
        { email: null },
        { $unset: { email: "" } }
    );
    console.log(`✓ Cleaned ${result.modifiedCount} documents with null email`);

    // Show final indexes
    const newIndexes = await collection.indexes();
    console.log('Indexes after fix:', JSON.stringify(newIndexes, null, 2));

    await client.close();
    console.log('\n✓ Done! Restart your backend server to recreate correct sparse indexes.');
}

fixIndexes().catch(console.error);
