// functions/index.js

const { onRequest } = require("firebase-functions/v2/https");
// const { initializeApp } = require("firebase-admin/app");
// const { getFirestore } = require("firebase-admin/firestore");
const cors = require('cors');

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const stripe = require('stripe')('sk_test_51Pvw5aLa8y4vN0FsgfUMmqA0AZMJQWCgEOndWRc1cMefDnLvABcK6qfgUgoZbBsZ4Ri3vuRpuiEGvuuYW3dMVl1600osR5AXm7'

);

admin.initializeApp();

const db = admin.firestore();

const corsHandler = cors({
    origin: 'https://wetgenie-3b39f.web.app', // Your frontend origin
    credentials: true,
});

// Cloud Function to increment the counter
exports.incrementCounter = onRequest((req, res) => {
    console.log('in the incrementing function ');
    return corsHandler(req, res, async () => {
        console.log('in the corsHandler');
        const counterRef = db.collection('counters').doc('clickCounter');
        
        try {
            console.log('trying to add one');
            // Run a transaction to increment the counter atomically
 
            await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(counterRef);

                if (doc.exists) {
                    console.log("Document data:", doc.data());
                } else {
                    console.log("No such document!");
                }   

                const newCount = (doc.exists ? doc.data().count : 0) + 1;
                transaction.set(counterRef, { count: newCount }, { merge: true });
            });

            return res.status(200).json({ message: 'Counter incremented successfully' });
        } catch (error) {
            console.error('Error incrementing counter:', error);
            return res.status(500).json({ error: 'Failed to increment counter at backend' });
        }
    });
});

exports.stripeWebhook = functions.https.onRequest(
    { verify: (req, res, buf) => { req.rawBody = buf } },
    async (req, res) => {
      const sig = req.headers['stripe-signature'];
      const webhookSecret = 'whsec_NOc1ggTyxO2f8rHo04bShf7NOtzDWLhA';
  
      let event;
  
      try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
  
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await handleCheckoutSession(session);
      }
  
      res.status(200).json({ received: true });
    }
  );
  
  async function handleCheckoutSession(session) {
    const customerEmail = session.customer_details.email;
  
    try {
      await db.collection('recipes').doc(customerEmail).set(
        {
          user_group: 'SUCCESS',
          hasPaid: true,
          paymentDate: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      console.log(`User ${customerEmail} updated successfully.`);
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
    }
  }
