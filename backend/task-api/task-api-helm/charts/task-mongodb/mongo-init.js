// check if replica set is initiated
function initMongo() {
    ADMIN_USER = process.env.MONGO_INITDB_ROOT_USERNAME;
    ADMIN_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD;

    console.log('Checking if replica set is initiated...');
    try {
        const status = rs.status();
        console.log('Replica set status:', status);
        console.log("Skipping setup as replica set is already initiated")
        return;
    } catch (e) {
        console.log('Replica set not initiated. Initiating replica set...');
    }
        
    try {
        rs.initiate();
        // wait for replica set to initiate
        sleep(5000);
        console.log('Replica set initiated successfully');

        const isMaster = rs.isMaster();
        console.log('Is master:', isMaster);

        // create users using primary node
        console.log('Creating users...');
        admin = db.getSiblingDB('admin');

        admin.createUser({
            user: ADMIN_USER,
            pwd: ADMIN_PASS,
            roles: [
                {
                    role: 'root',
                    db: 'admin'
                }
            ]
        });
        console.log('Admin user created successfully');

        // authenticate as admin
        const auth = admin.auth(ADMIN_USER, ADMIN_PASS);
        console.log('Authentication:', auth);        

        // console.log('Creating task user...');
        // task = db.getSiblingDB('task');
        // task.createUser({
        //     user: 'admin',
        //     pwd: 'admin',
        //     roles: [
        //         {
        //             role: 'readWrite',
        //             db: 'task'
        //         }
        //     ]
        // });
        // console.log('Users created successfully');
        // // add a record
        // task.task.insertOne({
        //     "name": "test",
        //     "amount": 100
        // });
    } catch (e) {
        console.log('Error creating users:', e);
    }
}

initMongo();