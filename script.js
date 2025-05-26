// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5bR_lgEgVU8Hno8mGNYbqfT1RJn-dOyI",
  authDomain: "livechat-83d0a.firebaseapp.com",
  projectId: "livechat-83d0a",
  storageBucket: "livechat-83d0a.firebasestorage.app",
  messagingSenderId: "883355572861",
  appId: "1:883355572861:web:25d900341af321e7286f14",
  measurementId: "G-FQYJ6L9MYJ"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;

function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      currentUser = result.user;
      document.getElementById("user-info").innerHTML =
        "Connecté : <strong>" + currentUser.displayName + "</strong>";
      listenForMessages();
    })
    .catch((error) => console.error("Erreur de connexion :", error));
}

function sendMessage() {
  const msg = document.getElementById("message").value;
  if (!msg || !currentUser) return;
  db.ref("messages").push({
    name: currentUser.displayName,
    text: msg,
    time: Date.now()
  });
  document.getElementById("message").value = "";
}

function listenForMessages() {
  const chat = document.getElementById("chat");
  db.ref("messages").on("child_added", (snapshot) => {
    const data = snapshot.val();
    const msgEl = document.createElement("div");
    msgEl.textContent = data.name + " : " + data.text;
    chat.appendChild(msgEl);
    chat.scrollTop = chat.scrollHeight;
  });
}