// functions/index.js

const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

const db = getFirestore();

// Cloud Function to increment the counter
exports.incrementCounter = onRequest(async (req, res) => {
    const counterRef = db.collection('counters').doc('clickCounter');
    
    try {
        // Run a transaction to increment the counter atomically
        await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(counterRef);
            const newCount = (doc.exists() ? doc.data().count : 0) + 1;
            transaction.set(counterRef, { count: newCount }, { merge: true });
        });

        return res.status(200).json({ message: 'Counter incremented successfully' });
    } catch (error) {
        console.error('Error incrementing counter:', error);
        return res.status(500).json({ error: 'Failed to increment counter' });
    }
});

exports.decrementCounter = onRequest(async (req, res) => {
    const counterDocRef = db.collection('counters').doc('clickCounter');
    
    try {
        // Run a transaction to decrement the counter atomically       
        await db.runTransaction(async (transaction) => {
            const counterDoc = await transaction.get(counterDocRef);

            if (!counterDoc.exists) {
                // If the document doesn't exist, create it with a default counter value of 0
                transaction.set(counterDocRef, { count: 0 });
            } else {
                // Decrement the counter, but don't let it go below 0
                const currentCount = counterDoc.data().count || 0;
                const newCount = Math.max(currentCount - 1, 0);
                transaction.update(counterDocRef, { count: newCount });
            }
        });

        return res.status(200).send('Counter decremented successfully!');
    } catch (error) {
        console.error('Error decrementing counter:', error);
        return res.status(500).send('Error decrementing counter');
    }
});

// CJS Import necessary modules from Firebase Functions v2
// const { onRequest } = require("firebase-functions/v2/https");
// const { defineSecret } = require("firebase-functions/params");
// const admin = require("firebase-admin");
// const Stripe = require("stripe");
// const cors = require("cors")({ origin: true });

// // Initialize Firebase Admin SDK
// admin.initializeApp();

// // Define Secrets (Recommended to use Firebase Secret Manager for sensitive data)
// const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
// const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

// // Initialize Stripe with Secret Key
// // Define the onRequest function
// // async function onRequest(req, res) {
// //     // Initialize Stripe with Secret Key inside the function
// //     const stripe = Stripe(stripeSecretKey.value());
// //     const endpointSecret = stripeWebhookSecret.value();

// //     // Your request handling logic here
// // }

// // Firestore Reference
// const db = admin.firestore();

// // Initialize CORS middleware
// const corsMiddleware = cors({ origin: true });

// exports.createCheckoutSession = onRequest(async (req, res) => {
//     // Enable CORS
//     cors(req, res, async () => {
//       if (req.method !== "POST") {
//         return res.status(405).send({ error: "Method Not Allowed" });
//       }
  
//       const { email } = req.body;
  
//       if (!email) {
//         return res.status(400).send({ error: "Missing email in request body" });
//       }
  
//       try {
//         // Create a Checkout Session
//         const session = await stripe.checkout.sessions.create({
//           payment_method_types: ["card"],
//           mode: "payment",
//           customer_email: email, // Automatically collect email via Stripe
//           line_items: [
//             {
//               price: "price_1Q59mKLa8y4vN0FsDEU8reOK", // TODO: Replace with your actual Stripe Price ID
//               quantity: 1,
//             },
//           ],
//         //   success_url: "https://your-domain.com/success?session_id={CHECKOUT_SESSION_ID}",
//         //   cancel_url: "https://your-domain.com/cancel",
//           metadata: {
//             email: email,
//           },
//         });
  
//         // Return the session URL to redirect the user
//         res.status(200).json({ url: session.url });
//       } catch (error) {
//         console.error("Error creating Checkout Session:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     });
//   });


  // Handle Stripe Webhook Function
// exports.handleStripeWebhook = onRequest(async (req, res) => {
//     // Retrieve the Stripe-Signature header
//     const sig = req.headers["stripe-signature"];
  
//     let event;
  
//     try {
//       // Construct the event using the webhook secret
//       event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
//     } catch (err) {
//       console.error("Webhook signature verification failed.", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }
  
//     // Handle the event
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const userEmail = session.metadata.email;
  
//       try {
//         // Query Firestore for the user with the matching email
//         const usersRef = admin.firestore().collection("recipes");
//         const snapshot = await usersRef.where("email", "==", userEmail).get();
  
//         if (snapshot.empty) {
//           console.log(`No user found with email: ${userEmail}`);
//           return res.status(200).send({ received: true });
//         }
  
//         // Update each matching user's group to 'paid'
//         snapshot.forEach(async (doc) => {
//           await doc.ref.update({ user_group: "SUCCESS" });
//           console.log(`User ${doc.id} upgraded to paid.`);
//         });
//       } catch (error) {
//         console.error("Error updating user group:", error);
//         return res.status(500).send({ error: "Internal Server Error" });
//       }
//     } else {
//       console.log(`Unhandled event type ${event.type}`);
//     }
  
//     // Acknowledge receipt of the event
//     res.json({ received: true });
//   });
