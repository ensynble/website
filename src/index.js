// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
// import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
// import { increment } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// // Initialize Firebase
// const firebaseApp = initializeApp({
//     apiKey: "AIzaSyC2oCdFm9GoQ-cWu2iRTfiQtrhI0knZgcU",
//     authDomain: "wetgenie-3b39f.firebaseapp.com",
//     projectId: "wetgenie-3b39f",
//     storageBucket: "wetgenie-3b39f.appspot.com",
//     messagingSenderId: "972891305048",
//     appId: "1:972891305048:web:066a70010294d34a9b462d",
//     measurementId: "G-CNQYR5FFH5"
// });

// const auth = getAuth(firebaseApp);

// // Listen for authentication state changes
// onAuthStateChanged(auth, user => {
//     if(user != null){
//         console.log('logged in');
//         // Optionally, fetch and display user-specific data
//     } else {
//         console.log('no user');
//         // Optionally, redirect to login or show limited access
//     }
// });

// const db = getFirestore(firebaseApp);

// // Counter Elements
// const counterElement = document.getElementById('counter');
// const incrementButton = document.getElementById('increment-btn');
// const decrementButton = document.getElementById('decrement-btn');

// // Payment Button
// const purchaseButton = document.getElementById('purchase-btn');

// // Firestore Counter Document
// const counterDoc = doc(collection(db, 'counters'), 'counter');

// // Function to update counter display
// function updateCounterDisplay(count) {
//   counterElement.textContent = count;
// }

// // Initialize Counter
// getDoc(counterDoc).then((docSnap) => {
//     if (docSnap.exists()) {
//       updateCounterDisplay(docSnap.data().count);
//     } else {
//       setDoc(counterDoc, { count: 0 });
//       updateCounterDisplay(0);
//     }
// });

// // Real-time Counter Updates
// onSnapshot(counterDoc, (docSnap) => {
//     if (docSnap.exists()) {
//       updateCounterDisplay(docSnap.data().count);
//     }
// });

// // Increment Counter
// incrementButton.addEventListener('click', () => {
//     updateDoc(counterDoc, {
//       count: increment(1)
//     }).catch((error) => {
//       console.error("Error updating counter:", error);
//     });
// });
  
// // Decrement Counter
// decrementButton.addEventListener('click', () => {
//     updateDoc(counterDoc, {
//       count: increment(-1)
//     }).catch((error) => {
//       console.error("Error updating counter:", error);
//     });
// });

// // Optional: Initial Increment (remove if not needed)
// updateDoc(counterDoc, {
//     count: increment(1)
// }).catch((error) => {
//     console.error("Error initializing counter:", error);
// });

// // Stripe Integration

// // Replace with your Stripe Publishable Key
// const stripe = Stripe('pk_test_51Pvw5aLa8y4vN0Fsuy80k4VqCAHKLy8Wa7hKWizWK9iYStaCgh96qrZBEovC4QBP0NhWzihHa3cjfQ5GSpFQaPRD007sj3OLFL'); // TODO: Replace with your actual key

// // Handle Purchase Button Click
// purchaseButton.addEventListener('click', async () => {
//     try {
//         // Collect user's email via a prompt or a form
//         const email = prompt("Please enter your email to proceed with the purchase:");

//         if (!email) {
//             alert('Email is required to proceed.');
//             return;
//         }

//         // Call your backend to create a Checkout Session
//         const response = await fetch('https://us-central1-wetgenie-3b39f.cloudfunctions.net/createCheckoutSession', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 email: email
//                 // You can pass other data here if needed
//             })
//         });

//         const session = await response.json();

//         if(session.url){
//             // Redirect to Stripe Checkout
//             window.location.href = session.url;
//         } else {
//             console.error('No session URL returned');
//             alert('Failed to create checkout session.');
//         }

//     } catch (error) {
//         console.error('Error creating checkout session:', error);
//         alert('An error occurred while processing your payment.');
//     }
// });
