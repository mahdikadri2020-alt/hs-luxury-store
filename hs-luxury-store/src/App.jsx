import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  Trash2,
  Users,
  CheckCircle,
  Search,
  LogOut,
  Lock,
  User,
  X,
  MapPin,
  Phone,
  Truck,
  Upload,
  Home,
  Building2,
  Edit,
  ShieldCheck,
  Star,
  Clock,
  ArrowLeft,
  Loader2, 
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  query
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';

// --- Firebase Configuration (ENVIRONMENT SETUP) ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'hs-luxury-prod';

// --- Algerian Administrative Data (Comprehensive) ---
const ALGERIA_DATA = {
  "01 Adrar": ["Adrar", "Reggane", "In Zghmir", "Aoulef", "Fenoughil", "Tsabit", "Timiaouine", "Tamest", "Zaouiet Kounta", "Sali", "Akabli", "Tit"],
  "02 Chlef": ["Chlef", "Ténès", "Boukadir", "Oued Fodda", "Chettia", "Marsa", "Zeboudja", "Sobha", "Sendjas", "El Karimia", "El Hadjadj", "Ouled Ben Abdelkader"],
  "03 Laghouat": ["Laghouat", "Aflou", "Ain Madhi", "Hassi R'Mel", "Sidi Makhlouf", "Ksar El Hirane", "El Ghicha", "Brida", "Gueltat Sidi Saad", "Oued M'Zi"],
  "04 Oum El Bouaghi": ["Oum El Bouaghi", "Ain Beida", "Ain M'lila", "Ain Fakroun", "Meskiana", "Ain Kercha", "Souk Naamane", "Fkirina", "Dhil"],
  "05 Batna": ["Batna", "Arris", "Barika", "Merouana", "Ain Touta", "N'Gaous", "Tazoult", "Timgad", "El Madher", "Thniet El Abed", "Chemora", "Ichemoul"],
  "06 Béjaïa": ["Béjaïa", "Akbou", "El Kseur", "Kherrata", "Seddouk", "Tichy", "Aokas", "Sidi Aich", "Timezrit", "Amizour", "Adekar", "Draâ El Kaïd"],
  "07 Biskra": ["Biskra", "Ouled Djellal", "Tolga", "Sidi Okba", "Zeribet El Oued", "Sidi Khaled", "El Kantara", "Lioua", "M'Chouneche", "Foughala"],
  "08 Béchar": ["Béchar", "Kenadsa", "Taghit", "Abadla", "Beni Ounif", "Igli", "Tabelbala", "Lahmar", "Mergueb", "Ouled Khoudir"],
  "09 Blida": ["Blida", "Boufarik", "Bouinan", "Larbaâ", "Meftah", "El Affroun", "Chebli", "Mouzaia", "Soumaa", "Chréa", "Bni Mered", "Oued El Alleug"],
  "10 Bouira": ["Bouira", "Lakhdaria", "Sour El Ghozlane", "Ain Bessem", "M'Chedallah", "Bechloul", "Kadiria", "Haizer", "Ahl El Ksar", "Taghzout"],
  "11 Tamanrasset": ["Tamanrasset", "In Salah", "In Ghar", "Abalessa", "Idles", "Tazrouk", "In Amguel", "Foggaret Ezzaouia"],
  "12 Tébessa": ["Tébessa", "Bir El Ater", "Cheria", "Ouenza", "Morsott", "Negrine", "Hammamet", "Al-Aouinet", "El Kouif", "Bekkaria"],
  "13 Tlemcen": ["Tlemcen", "Maghnia", "Ghazaouet", "Remchi", "Sebdou", "Mansourah", "Nedroma", "Hennaya", "Ouled Mimoun", "Bensekrane", "Marsa Ben M'Hidi"],
  "14 Tiaret": ["Tiaret", "Sougueur", "Frenda", "Ksar Chellala", "Mahdia", "Rahouia", "Dahmouni", "Hamadia", "Medrissa", "Ain Deheb"],
  "15 Tizi Ouzou": ["Tizi Ouzou", "Azazga", "Draa El Mizan", "Tigzirt", "Boghni", "Larbaâ Nath Irathen", "Azeffoun", "Mekla", "Ouadhias", "Tizi Gheniff"],
  "16 Alger": ["Sidi M'Hamed", "Bab El Oued", "Cheraga", "Hydra", "Kouba", "Rouiba", "Zeralda", "Bir Mourad Rais", "Dar El Beida", "Staoueli", "El Biar", "Bachdjerrah", "Bordj El Kiffan", "Dely Ibrahim", "Bouzareah", "Ain Taya", "Draria", "Bab Ezzouar", "Hussein Dey"],
  "17 Djelfa": ["Djelfa", "Ain Oussera", "Hassi Bahbah", "Messaad", "El Idrissia", "Birine", "Charef", "Dar Chioukh", "Had-Sahary", "Zaafrane"],
  "18 Jijel": ["Jijel", "Taher", "El Milia", "Chekfa", "El Aouana", "Ziama Mansouriah", "Djimla", "Sidi Abdelaziz", "Settara", "El Ancer"],
  "19 Sétif": ["Sétif", "El Eulma", "Ain Azel", "Ain Oulmene", "Ain Arnat", "Bouandas", "Amoucha", "Babor", "Salah Bey", "Hammâm Soukhna", "Guellal"],
  "20 Saïda": ["Saïda", "Youb", "Hassasna", "Ain El Hadjar", "Sidi Boubekeur", "Moulay Larbi", "Ain Soltane"],
  "21 Skikda": ["Skikda", "Collo", "Azzaba", "El Harrouch", "Tamalous", "Ben Azzouz", "Filfila", "Hamadi Krouma", "Ramdane Djamel", "Zerdaza"],
  "22 Sidi Bel Abbès": ["Sidi Bel Abbès", "Sfisef", "Telagh", "Tenira", "Ben Badis", "Tessala", "Sidi Ali Benyoub", "Mostefa Ben Brahim"],
  "23 Annaba": ["Annaba", "El Bouni", "El Hadjar", "Berrahal", "Seraïdi", "Chetaïbi", "Sidi Amar", "Ain Berda", "Tréat"],
  "24 Guelma": ["Guelma", "Bouchegouf", "Oued Zenati", "Héliopolis", "Hammam Debagh", "Guelaat Bou Sbaa", "Nechmaya", "Boumahra Ahmed"],
  "25 Constantine": ["Constantine", "El Khroub", "Hamma Bouziane", "Didouche Mourad", "Ain Smara", "Zighoud Youcef", "Ibn Ziad", "Ouled Rahmoune"],
  "26 Médéa": ["Médéa", "Ksar El Boukhari", "Berrouaghia", "Beni Slimane", "Tablat", "Ouamri", "Ain Boucif", "Seghouane", "Ouzera", "Chahbounia"],
  "27 Mostaganem": ["Mostaganem", "Bouguirat", "Sidi Ali", "Achaacha", "Hassi Maameche", "Mesra", "Ain Nouissy", "Stidia", "Sidi Lakhdar"],
  "28 M'Sila": ["M'Sila", "Bou Saada", "Sidi Aissa", "Magra", "Belaiba", "Berhoum", "Hammam Dhalaa", "Ain El Hadjel", "Ouled Derradj"],
  "29 Mascara": ["Mascara", "Sig", "Mohammadia", "Tighennif", "Ghriss", "Oued Taria", "Bou Hanifia", "Zahana", "Hachem"],
  "30 Ouargla": ["Ouargla", "Hassi Messaoud", "Touggourt", "N'Goussa", "Sidi Khouiled", "El Borma", "Rouissat", "Ain Beida"],
  "31 Oran": ["Oran", "Arzew", "Bir El Djir", "Es Senia", "Ain El Turk", "Gdyel", "Bethioua", "Misserghin", "Oued Tlelat", "Boutlelis"],
  "32 El Bayadh": ["El Bayadh", "Bougtob", "Brezina", "El Abiodh Sidi Cheikh", "Rogassa", "Chellala", "El Ghassoul"],
  "33 Illizi": ["Illizi", "Djanet", "In Amenas", "Bordj Omar Driss", "Debdeb", "Bordj El Haouas"],
  "34 Bordj Bou Arréridj": ["Bordj Bou Arréridj", "Ras El Oued", "Medjana", "Mansoura", "El Achir", "Bordj Ghedir", "Bir Kasdali", "Bordj Zemoura"],
  "35 Boumerdès": ["Boumerdès", "Boumerdès", "Boudouaou", "Dellys", "Khemis El Khechna", "Thénia", "Isser", "Zemmouri", "Corso", "Ouled Hedadj"],
  "36 El Tarf": ["El Tarf", "El Kala", "Drean", "Besbes", "Ben M'Hidi", "Bouhadjar", "Bouteldja", "Chatt"],
  "37 Tindouf": ["Tindouf", "Oum El Assel"],
  "38 Tissemsilt": ["Tissemsilt", "Theniet El Had", "Lardjem", "Ammari", "Bordj Bou Naama", "Khemisti", "Layoune"],
  "39 El Oued": ["El Oued", "Guémar", "Bayadha", "Robbah", "Magrane", "Debila", "Hassi Khalifa", "Reguiba", "Kouinine"],
  "40 Khenchela": ["Khenchela", "Kais", "Chechar", "Babar", "Bouhmama", "Ain Touila", "Ensigha", "El Hamma"],
  "41 Souk Ahras": ["Souk Ahras", "Sedrata", "M'daourouch", "Taoura", "Merahna", "Haddada", "Ain Soltane", "M'daourouch"],
  "42 Tipaza": ["Tipaza", "Cherchell", "Koléa", "Bou Ismaïl", "Hadjout", "Fouka", "Gouraya", "Attatba", "Bouharoun", "Nador"],
  "43 Mila": ["Mila", "Chelghoum Laid", "Ferdjioua", "Teleghma", "Grarem Gouga", "Oued Endja", "Rouached", "Tadjenanet"],
  "44 Aïn Defla": ["Aïn Defla", "Khemis Miliana", "Miliana", "El Attaf", "Djendel", "Djelida", "Hammama Righa", "Bourached"],
  "45 Naâma": ["Naâma", "Ain Sefra", "Mecheria", "Asla", "Moghrar", "Tiout", "Kasdir"],
  "46 Aïn Témouchent": ["Aïn Témouchent", "Beni Saf", "Hammam Bou Hadjar", "El Amria", "El Malah", "Terga", "Oulhaça Gheraba"],
  "47 Ghardaïa": ["Ghardaïa", "Metlili", "El Guerrara", "Bounoura", "Zelfana", "Dhayet Bendhahoua", "Sebseb", "Mansoura"],
  "48 Relizane": ["Relizane", "Oued Rhiou", "Mazouna", "Yellel", "Ammi Moussa", "Zemmora", "Djidiouia", "El Matmar"],
  "49 Timimoun": ["Timimoun", "Aougrout", "Charouine", "Talmine", "Ksar Kaddour", "Ouled Said"],
  "50 Bordj Badji Mokhtar": ["Bordj Badji Mokhtar", "Timiaouine"],
  "51 Ouled Djellal": ["Ouled Djellal", "Sidi Khaled", "Besbes", "Chaïba", "Doucen"],
  "52 Béni Abbès": ["Béni Abbès", "Kerzaz", "Igli", "El Ouata", "Ouled Khoudir", "Timoudi"],
  "53 In Salah": ["In Salah", "In Ghar", "Foggaret Ezzaouia"],
  "54 In Guezzam": ["In Guezzam", "Tin Zaouatine"],
  "55 Touggourt": ["Touggourt", "Temacine", "Megarine", "Tebesbest", "Blidet Amor", "Nezla"],
  "56 Djanet": ["Djanet", "Bordj El Haouas"],
  "57 El M'Ghair": ["El M'Ghair", "Djamaa", "Still", "Mrara"],
  "58 El Meniaa": ["El Meniaa", "Hassi Gara", "Hassi Fehal"]
};

const ALGERIA_WILAYAS = Object.keys(ALGERIA_DATA).sort();

const SHOE_SIZES = [];
for (let s = 34; s <= 46; s += 0.5) SHOE_SIZES.push(s);

const PRESET_COLORS = [
  { name: 'Bleu', label: 'أزرق', hex: '#0000FF' },
  { name: 'Vert', label: 'أخضر', hex: '#008000' },
  { name: 'Rouge', label: 'أحمر', hex: '#FF0000' },
  { name: 'Noir', label: 'أسود', hex: '#000000' },
  { name: 'Blanc', label: 'أبيض', hex: '#FFFFFF' },
  { name: 'Gris', label: 'رمادي', hex: '#808080' },
  { name: 'Beige', label: 'بيج', hex: '#F5F5DC' },
  { name: 'Marron', label: 'بني', hex: '#8B4513' }
];

/**
 * UTILITY: Deep Sanitization for Firestore
 */
const deepCleanFirestore = (data) => {
  if (data === undefined || data === null) return null;
  if (typeof data !== 'object') return data;
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map(item => deepCleanFirestore(item)).filter(i => i !== null);
  const cleaned = {};
  Object.keys(data).forEach(key => {
    const val = deepCleanFirestore(data[key]);
    if (val !== null && val !== undefined) cleaned[key] = val;
  });
  return cleaned;
};

/**
 * COMPONENT: LOGIN GATE
 */
const LoginGate = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (username === 'admin' && password === 'hm156324789') {
          onLoginSuccess();
      } else {
          setError("Identifiants incorrects");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl relative">
        <button onClick={onCancel} className="absolute top-4 right-4 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition">
             <X size={20} />
        </button>
        <div className="text-center mb-10 text-center">
          <div className="w-16 h-16 bg-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl text-center"><Lock className="text-white" /></div>
          <h2 className="text-2xl font-black text-center text-neutral-900">H&S Administration</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4" dir="rtl">
          <input required className="w-full p-4 bg-neutral-50 border rounded-2xl outline-none focus:border-amber-500 transition-colors" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} />
          <input required type="password" className="w-full p-4 bg-neutral-50 border rounded-2xl outline-none focus:border-amber-500 transition-colors" placeholder="كلمة السر" value={password} onChange={e => setPassword(e.target.value)} />
          
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold justify-center">
                <AlertCircle size={14} /> {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-black text-white p-5 rounded-2xl font-bold uppercase tracking-widest text-center flex items-center justify-center hover:bg-neutral-800 transition">
            {loading ? <Loader2 className="animate-spin" /> : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * COMPONENT: PRODUCT CARD (FOR LANDING PAGE)
 */
const ProductCard = ({ product }) => {
  const mainImg = product.mainImage || (product.variants?.[0]?.image) || '';
  
  // Hash Routing Logic
  const handleNavigate = () => {
    window.location.hash = `product/${product.id}`;
  };

  return (
    <div className="bg-white p-4 md:p-5 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500 group flex flex-col cursor-pointer" onClick={handleNavigate}>
      <div className="relative overflow-hidden aspect-square rounded-[1.5rem] mb-4 bg-neutral-50 text-center">
        {mainImg ? (
            <img src={mainImg} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt={product.name} />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300"><Package size={40} /></div>
        )}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center">
           <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform">
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-800">Commander</span>
           </div>
        </div>
      </div>
      <div className="text-center space-y-1">
        <h4 className="font-bold text-[13px] uppercase tracking-tight text-neutral-800 line-clamp-1">{String(product.name)}</h4>
        <p className="text-amber-700 font-serif font-black text-sm">{Number(product.price).toLocaleString()} DA</p>
      </div>
    </div>
  );
};

/**
 * COMPONENT: ADMIN PANEL
 */
const AdminPanel = ({ onLogout, products, orders, deliveryPrices, notify }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliverySearch, setDeliverySearch] = useState('');
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, collection }
  
  const [formData, setFormData] = useState({ name: '', price: '', category: 'Chaussures', description: '', sizes: [], variants: [] });
  const [curVariant, setCurVariant] = useState({ color: '', image: '' });
  const [isCompressing, setIsCompressing] = useState(false); // New state for loading indicator

  const filteredWilayas = useMemo(() => {
    return ALGERIA_WILAYAS.filter(w => w.toLowerCase().includes(deliverySearch.toLowerCase()));
  }, [deliverySearch]);

  // Utility to compress image
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500; // Resize to reasonable max width
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          // Convert to JPEG with 0.6 quality to reduce size but keep decent quality
          resolve(canvas.toDataURL('image/jpeg', 0.6)); 
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleVariantImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressedBase64 = await compressImage(file);
        setCurVariant({ ...curVariant, image: compressedBase64 });
      } catch (err) {
        notify("Erreur lors du traitement de l'image", "error");
        console.error(err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleAddVariant = () => {
    if (!curVariant.color || !curVariant.image) {
        setFormError("Photo et couleur requises");
        return;
    }
    setFormData({ ...formData, variants: [...formData.variants, { color: String(curVariant.color), image: String(curVariant.image) }] });
    setCurVariant({ color: '', image: '' });
    setFormError('');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    if (formData.variants.length === 0 || formData.sizes.length === 0) {
        setFormError("Ajoutez au moins une variante (couleur+photo) et une pointure.");
        return;
    }
    setIsSubmitting(true);
    try {
      const payload = deepCleanFirestore({
        ...formData,
        price: Number(formData.price),
        mainImage: formData.variants[0].image,
        updatedAt: new Date().toISOString()
      });
      if (editingId) {
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', editingId), payload);
          notify("Produit mis à jour", "success");
      }
      else { 
          payload.createdAt = new Date().toISOString(); 
          await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'products'), payload); 
          notify("Produit créé", "success");
      }
      setFormData({ name: '', price: '', category: 'Chaussures', description: '', sizes: [], variants: [] });
      setEditingId(null); setActiveTab('products');
    } catch (err) { 
        console.error("Firestore Error:", err);
        if (err.code === 'resource-exhausted' || err.toString().includes('size')) {
             notify("حجم الصور كبير جداً (تجاوز الحد)", "error");
        } else {
             notify("Erreur: " + (err.message || "Inconnue"), "error"); 
        }
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', deleteConfirm.collection, deleteConfirm.id));
        notify("Supprimé avec succès", "success");
    } catch(err) {
        notify("Erreur lors de la suppression", "error");
    } finally {
        setDeleteConfirm(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F8F9FA] font-sans overflow-hidden">
        {/* Delete Modal */}
        {deleteConfirm && (
            <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-4">
                    <h3 className="font-bold text-lg">Confirmer la suppression ?</h3>
                    <p className="text-sm text-neutral-500">Cette action est irréversible.</p>
                    <div className="flex gap-2 justify-center">
                        <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-xl bg-neutral-100 font-bold text-xs hover:bg-neutral-200">Annuler</button>
                        <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600">Supprimer</button>
                    </div>
                </div>
            </div>
        )}

      {/* Responsive Sidebar: Full width row on mobile, Sidebar on desktop */}
      <aside className="w-full md:w-64 bg-[#1A1A1A] text-white flex flex-row md:flex-col justify-between md:justify-start items-center md:items-stretch p-4 md:p-6 shadow-xl sticky top-0 z-20 shrink-0 gap-4 md:gap-0 h-auto md:h-screen">
        <h2 className="hidden md:block text-lg md:text-xl font-serif tracking-widest text-amber-500 mb-0 md:mb-10 text-center uppercase tracking-[0.3em] whitespace-nowrap">H&S Admin</h2>
        
        <nav className="flex-1 flex flex-row md:flex-col gap-2 md:space-y-2 w-full md:w-auto overflow-x-auto md:overflow-visible items-center md:items-stretch no-scrollbar">
          <button onClick={() => setActiveTab('dashboard')} className={`min-w-[max-content] md:min-w-0 md:w-full flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl transition ${activeTab === 'dashboard' ? 'bg-amber-600 shadow-lg' : 'hover:bg-neutral-800 text-neutral-400'}`}><LayoutDashboard size={18} /> <span className="text-xs font-bold uppercase hidden md:inline">Stats</span></button>
          <button onClick={() => { setActiveTab('products'); setEditingId(null); }} className={`min-w-[max-content] md:min-w-0 md:w-full flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl transition ${activeTab === 'products' ? 'bg-amber-600 shadow-lg' : 'hover:bg-neutral-800 text-neutral-400'}`}><Package size={18} /> <span className="text-xs font-bold uppercase text-left hidden md:inline">Stock</span></button>
          <button onClick={() => setActiveTab('orders')} className={`min-w-[max-content] md:min-w-0 md:w-full flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl transition ${activeTab === 'orders' ? 'bg-amber-600 shadow-lg' : 'hover:bg-neutral-800 text-neutral-400'}`}><ShoppingCart size={18} /> <span className="text-xs font-bold uppercase text-left hidden md:inline">Ventes</span></button>
          <button onClick={() => setActiveTab('delivery')} className={`min-w-[max-content] md:min-w-0 md:w-full flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl transition ${activeTab === 'delivery' ? 'bg-amber-600 shadow-lg' : 'hover:bg-neutral-800 text-neutral-400'}`}><Truck size={18} /> <span className="text-xs font-bold uppercase text-left hidden md:inline">Livraison</span></button>
          <button onClick={() => { setActiveTab('add'); setEditingId(null); setFormData({name:'', price:'', category:'Chaussures', description:'', sizes:[], variants:[]}); }} className={`min-w-[max-content] md:min-w-0 md:w-full flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl transition ${activeTab === 'add' ? 'bg-amber-600 shadow-lg' : 'hover:bg-neutral-800 text-neutral-400'}`}><PlusCircle size={18} /> <span className="text-xs font-bold uppercase text-left hidden md:inline">Nouveau</span></button>
        </nav>
        
        <button onClick={onLogout} className="mt-0 md:mt-10 flex items-center gap-3 p-3 md:p-4 text-neutral-500 hover:text-red-400 transition font-bold border-t-0 md:border-t border-neutral-800 pt-0 md:pt-6 text-center"><LogOut size={18} /> <span className="hidden md:inline">Quitter</span></button>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in">
             <h1 className="text-3xl md:text-4xl font-serif italic text-neutral-900 text-left">Vue d'ensemble</h1>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-amber-600 text-center mx-auto w-full"><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">Revenu</p><h3 className="text-3xl font-serif font-black mt-2 text-center">{orders.reduce((acc, order) => acc + (order.items || []).reduce((itemSum, item) => itemSum + (Number(item.price) || 0), 0), 0).toLocaleString()} DA</h3></div>
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-neutral-800 text-center mx-auto w-full"><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">Modèles</p><h3 className="text-3xl font-serif font-black mt-2 text-center">{products.length}</h3></div>
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-orange-500 text-center mx-auto w-full"><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">Attente</p><h3 className="text-3xl font-serif font-black mt-2 text-center">{orders.filter(o=>o.status==='pending').length}</h3></div>
             </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-[3rem] shadow-xl text-left animate-in slide-in-from-bottom-4">
             <h2 className="text-3xl font-serif italic mb-10 text-center">{editingId ? "Modifier" : "Ajouter"}</h2>
             <form onSubmit={handleSaveProduct} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <input required className="w-full p-5 bg-neutral-50 border rounded-2xl outline-none focus:border-amber-600 transition" placeholder="Nom" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} />
                    <input required type="number" className="w-full p-5 bg-neutral-50 border rounded-2xl outline-none focus:border-amber-600 transition" placeholder="Prix" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} />
                    <textarea className="w-full p-5 bg-neutral-50 border rounded-2xl outline-none focus:border-amber-600 transition resize-none h-32" placeholder="Description" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} />
                    
                    <div>
                        <p className="text-xs font-bold uppercase mb-2 text-neutral-400">Pointures disponibles</p>
                        <div className="grid grid-cols-5 gap-2 text-center">
                            {SHOE_SIZES.map(s => (
                            <button key={String(s)} type="button" onClick={() => {
                                const updated = formData.sizes.includes(s) ? formData.sizes.filter(x=>x!==s) : [...formData.sizes, s];
                                setFormData({...formData, sizes: updated});
                            }} className={`py-2 text-[9px] font-black border rounded-lg transition ${formData.sizes.includes(s) ? 'bg-amber-600 border-amber-600 text-white shadow-md' : 'bg-white hover:bg-neutral-50'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-200 space-y-4 text-center">
                       <div className="flex flex-wrap gap-2 justify-center py-2 text-center">
                          {PRESET_COLORS.map(c => (
                            <button key={c.name} type="button" onClick={() => setCurVariant({...curVariant, color: c.name})} className={`px-3 py-1.5 rounded-full border text-[9px] font-bold flex items-center gap-2 transition ${curVariant.color === c.name ? 'bg-black text-white scale-105' : 'bg-white hover:scale-105'}`}>
                              <div className="w-2 h-2 rounded-full border" style={{background: c.hex}}></div> {c.label}
                            </button>
                          ))}
                       </div>
                       
                       {/* Input for custom color */}
                       <input 
                         type="text" 
                         placeholder="أو اكتب لونًا مخصصًا (مثال: Beige)" 
                         className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-center text-sm font-bold outline-none focus:border-amber-600 transition"
                         value={curVariant.color} 
                         onChange={(e) => setCurVariant({...curVariant, color: e.target.value})} 
                       />

                       <label className="block cursor-pointer bg-white border-2 border-dashed p-4 rounded-2xl text-center hover:bg-neutral-50 transition relative overflow-hidden">
                         {isCompressing && (
                           <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                             <Loader2 className="animate-spin text-amber-600" />
                           </div>
                         )}
                         {curVariant.image ? <img src={curVariant.image} className="h-20 mx-auto object-contain" alt="" /> : <Upload size={24} className="mx-auto text-neutral-300" />}
                         <span className="text-[10px] text-neutral-400 block mt-2">
                           {isCompressing ? "Traitement de l'image..." : "Cliquez pour ajouter une photo"}
                         </span>
                         <input type="file" accept="image/*" className="hidden" onChange={handleVariantImageChange} />
                       </label>
                       <button type="button" onClick={handleAddVariant} disabled={isCompressing} className="w-full py-3 bg-neutral-900 text-white rounded-xl text-xs uppercase text-center hover:bg-black transition shadow-lg disabled:opacity-50">Ajouter la Variante</button>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center min-h-[50px] bg-neutral-50 rounded-2xl p-2">
                       {formData.variants.length === 0 && <span className="text-xs text-neutral-300 self-center">Aucune variante ajoutée</span>}
                       {formData.variants.map((v, i) => (
                         <div key={i} className="relative w-14 h-18 group">
                           <img src={v.image} className="w-full h-full object-cover rounded-xl border shadow-sm" alt="" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer rounded-xl" onClick={()=>{const u=[...formData.variants]; u.splice(i,1); setFormData({...formData, variants:u})}}><X className="text-white" size={14}/></div>
                           <p className="text-[7px] font-bold text-center mt-1 uppercase text-neutral-400 truncate w-full px-1">{String(v.color)}</p>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>

               {formError && (
                   <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2">
                       <AlertCircle size={16} /> {formError}
                   </div>
               )}

               <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white font-black py-6 rounded-[2rem] hover:bg-amber-900 transition flex items-center justify-center gap-4 text-xs text-center shadow-xl">
                 {isSubmitting ? <Loader2 className="animate-spin text-center" /> : editingId ? "Sauvegarder" : "Publier le produit"}
               </button>
             </form>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-neutral-100 overflow-hidden text-left animate-in fade-in">
             <div className="overflow-x-auto">
               <table className="w-full text-left min-w-[600px]">
                 <thead className="bg-neutral-50 border-b text-[10px] text-neutral-400 font-bold uppercase tracking-widest text-left">
                   <tr><th className="p-8 text-left">Pièce</th><th className="p-8 text-center">Détails</th><th className="p-8 text-center">Prix</th><th className="p-8 text-right">Actions</th></tr>
                 </thead>
                 <tbody className="divide-y divide-neutral-100">
                   {products.map(p => (
                     <tr key={p.id} className="hover:bg-neutral-50 transition">
                       <td className="p-8 flex items-center gap-4 text-left"><img src={p.mainImage} className="w-14 h-14 rounded-2xl object-cover shadow-sm bg-neutral-100" alt="" /><strong className="text-neutral-800 uppercase tracking-tight">{String(p.name)}</strong></td>
                       <td className="p-8 text-center text-[10px] text-neutral-400 uppercase">{p.variants?.length} Coul | {p.sizes?.length} Pt</td>
                       <td className="p-8 text-center font-serif font-black text-amber-700">{Number(p.price).toLocaleString()} DA</td>
                       <td className="p-8 text-right"><div className="flex justify-end gap-2"><button onClick={() => {setEditingId(p.id); setFormData({...p}); setActiveTab('add');}} className="p-3 text-neutral-400 hover:text-amber-600 transition"><Edit size={18} /></button><button onClick={() => setDeleteConfirm({id: p.id, collection: 'products'})} className="p-3 text-neutral-300 hover:text-red-500 transition"><Trash2 size={18} /></button></div></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            {orders.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(o => (
              <div key={o.id} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border-l-8 border-amber-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-10 text-left">
                <div className="flex gap-4 md:gap-6 items-start flex-1 text-left w-full">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-neutral-100 rounded-3xl flex items-center justify-center text-neutral-400 shrink-0"><Users size={24} className="md:w-8 md:h-8" /></div>
                  <div className="space-y-1 text-left w-full">
                    <h5 className="text-lg md:text-xl font-bold break-all">{String(o.customerName)} <span className="text-xs font-medium text-neutral-300">#{o.id.substring(0,6)}</span></h5>
                    <p className="text-xs md:text-sm text-neutral-500 font-bold flex items-center gap-2"><Phone size={14}/> {String(o.customerPhone)}</p>
                    <p className="text-xs md:text-sm text-neutral-500 font-bold flex items-center gap-2 uppercase"><MapPin size={14}/> {String(o.wilaya)} • {String(o.commune)}</p>
                    {o.deliveryMethod === 'desk' && <p className="text-[10px] text-amber-600 font-black bg-amber-50 inline-block px-2 py-1 rounded-md">BUREAU STOP-DESK</p>}
                    <div className="flex flex-wrap gap-2 mt-4">
                       {o.items?.map((it, idx) => (
                         <span key={idx} className="bg-neutral-50 text-[10px] font-black px-3 py-1 rounded-full border text-neutral-600 uppercase flex flex-wrap items-center gap-2">
                           {String(it.name)} 
                           <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 mx-1">{String(it.selectedColor)}</span> 
                           <span className="text-neutral-400">|</span> 
                           {String(it.selectedSize)}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                  <div>
                      <p className="text-xl md:text-2xl font-serif font-black text-neutral-900 text-right">{Number(o.total).toLocaleString()} DA</p>
                      <p className="text-xs text-neutral-400 font-bold uppercase mb-0 md:mb-4">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3 justify-end mt-0 md:mt-4">
                    {o.status === 'pending' ? 
                        <button onClick={() => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'orders', o.id), {status:'completed'})} className="p-3 md:p-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition shadow-xl shadow-green-50"><CheckCircle size={20}/></button>
                        : <span className="p-3 md:p-4 text-green-600 font-bold text-xs uppercase border border-green-200 rounded-2xl bg-green-50">Livré</span>
                    }
                    <button onClick={() => setDeleteConfirm({id: o.id, collection: 'orders'})} className="p-3 md:p-4 bg-neutral-50 text-neutral-300 rounded-2xl hover:text-red-500 transition border border-neutral-100"><Trash2 size={20}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-6 text-left animate-in fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-left">
               <h1 className="text-3xl md:text-4xl font-serif italic text-neutral-900 text-left">Gestion Tarifs</h1>
               <div className="relative w-full md:w-80"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" /><input type="text" placeholder="Rechercher wilaya..." className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-200 rounded-2xl text-sm font-bold shadow-sm focus:border-amber-600 outline-none transition" onChange={e => setDeliverySearch(e.target.value)} /></div>
             </div>
             <div className="bg-white rounded-[2rem] shadow-sm border border-neutral-100 overflow-hidden text-center mx-auto">
               <div className="overflow-x-auto">
                   <table className="w-full text-left min-w-[500px]">
                     <thead className="bg-neutral-50 border-b text-[10px] text-neutral-400 font-bold uppercase tracking-widest text-center">
                       <tr><th className="p-8 text-left">Wilaya</th><th className="p-8 text-center">Stop-desk (DA)</th><th className="p-8 text-center">Domicile (DA)</th></tr>
                     </thead>
                     <tbody className="divide-y divide-neutral-100">
                       {filteredWilayas.map(w => (
                         <tr key={w} className="hover:bg-neutral-50 transition text-center">
                           <td className="p-8 font-black text-neutral-800 text-left">{String(w)}</td>
                           <td className="p-8 text-center"><input type="number" className="w-20 md:w-28 p-3 border rounded-xl text-center font-black text-amber-700 bg-neutral-50 outline-none focus:bg-white focus:border-amber-500 transition" value={deliveryPrices[w]?.desk || ''} onChange={async (e) => await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'delivery_prices', w), { desk: Number(e.target.value) || 0 }, { merge: true })} /></td>
                           <td className="p-8 text-center"><input type="number" className="w-20 md:w-28 p-3 border rounded-xl text-center font-black text-amber-700 bg-neutral-50 outline-none focus:bg-white focus:border-amber-500 transition" value={deliveryPrices[w]?.home || ''} onChange={async (e) => await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'delivery_prices', w), { home: Number(e.target.value) || 0 }, { merge: true })} /></td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* Styles to hide scrollbar in mobile nav */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}

/**
 * MAIN APP
 */
export default function App() {
  const [view, setView] = useState('landing'); 
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryPrices, setDeliveryPrices] = useState({});
  const [isOrdering, setIsOrdering] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [activeSize, setActiveSize] = useState(null);
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('home'); 
  
  const [orderName, setOrderName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');

  // AUTHENTICATION INITIALIZATION
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
           await signInWithCustomToken(auth, __initial_auth_token);
        } else {
           await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // DATA SYNC
  useEffect(() => {
    if (!user) return;
    const unsubP = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), snap => setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() }))), (err) => console.log("Products Sync Error", err));
    const unsubO = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), snap => setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() }))), (err) => console.log("Orders Sync Error", err));
    const unsubD = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'delivery_prices'), snap => {
      const p = {}; snap.forEach(d => p[d.id] = d.data()); setDeliveryPrices(p);
    }, (err) => console.log("Delivery Sync Error", err));
    return () => { unsubP(); unsubO(); unsubD(); };
  }, [user]);

  // URL HASH NAVIGATION HANDLER
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      // Admin Route
      if (hash === '#admin') {
        if (!isLoggedIn) setShowLogin(true);
        else setView('admin');
        return;
      }

      // Product Route
      if (hash.startsWith('#product/')) {
        const id = hash.split('/')[1];
        // Only try to find if products are loaded
        if (products.length > 0) {
          const found = products.find(p => p.id === id);
          if (found) {
             setSelectedProduct(found);
             setView('product');
          } else {
             // Product not found (maybe deleted or invalid ID), go back to shop
             window.location.hash = '';
          }
        }
        return;
      }

      // Default Route (Landing)
      if (!hash || hash === '#') {
        setView('landing');
        setSelectedProduct(null);
        setShowLogin(false);
      }
    };

    // Run on mount and when products change (to handle deep links on initial load)
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products, isLoggedIn]); 

  const showToast = (msg, type = 'success') => {
      setToast({ show: true, msg, type });
      setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 4000);
  };

  const currentDeliveryCost = useMemo(() => {
    if (!selectedWilaya) return 0;
    const rates = deliveryPrices[selectedWilaya];
    return rates ? (deliveryMethod === 'home' ? Number(rates.home) : Number(rates.desk)) : 0;
  }, [selectedWilaya, deliveryMethod, deliveryPrices]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!activeSize) {
        showToast("Veuillez sélectionner votre pointure أولاً", 'error');
        return;
    }
    if (!selectedCommune) {
        showToast("Veuillez sélectionner votre commune", 'error');
        return;
    }

    // Validation du numéro de téléphone (Algérie : 05/06/07 + 8 chiffres)
    const phoneRegex = /^0(5|6|7)[0-9]{8}$/;
    if (!phoneRegex.test(orderPhone)) {
        showToast("رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05/06/07 ويتكون من 10 أرقام)", 'error');
        return;
    }
    
    setIsOrdering(true);
    try {
      const variant = selectedProduct.variants[activeVariantIdx];
      const payload = deepCleanFirestore({
        customerName: String(orderName),
        customerPhone: String(orderPhone),
        wilaya: String(selectedWilaya),
        commune: String(selectedCommune),
        deliveryMethod: String(deliveryMethod),
        items: [{ 
          name: String(selectedProduct.name), 
          price: Number(selectedProduct.price), 
          selectedSize: String(activeSize), 
          selectedColor: String(variant.color) 
        }],
        total: Number(selectedProduct.price) + currentDeliveryCost,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), payload);
      showToast("تم تسجيل طلبك بنجاح!");
      setOrderName(''); setOrderPhone('');
      setTimeout(() => { window.location.hash = ''; }, 1000);
    } catch (err) { showToast("Erreur Order", "error"); } finally { setIsOrdering(false); }
  };

  const renderContent = () => {
    if (view === 'admin' && isLoggedIn) {
      return <AdminPanel onLogout={() => window.location.hash = ''} products={products} orders={orders} deliveryPrices={deliveryPrices} notify={showToast} />;
    }

    if (view === 'product' && selectedProduct) {
        return (
          <div className="pt-24 bg-white animate-in fade-in duration-700 min-h-screen text-left">
              <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-16 text-left">
                 <button onClick={() => window.location.hash = ''} className="absolute top-28 left-6 flex items-center gap-2 text-neutral-400 hover:text-black transition uppercase font-black text-[10px] tracking-widest z-10">
                    <ArrowLeft size={16} /> <span>Magasin</span>
                 </button>
                 <div className="w-full md:w-1/2 space-y-6 text-center">
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-neutral-50 border border-neutral-100 mx-auto group">
                       <img src={selectedProduct.variants[activeVariantIdx]?.image} className="w-full h-full object-cover animate-in zoom-in-95 duration-700 transition-transform group-hover:scale-105" alt="" />
                       <div className="absolute top-6 left-6 bg-amber-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Premium</div>
                       
                       {/* COPY LINK BUTTON */}
                       <div className="absolute top-6 right-6">
                           <button 
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                showToast("تم نسخ الرابط!", "success");
                              }} 
                              className="p-3 bg-white/90 backdrop-blur rounded-full hover:bg-white transition text-neutral-600 shadow-md"
                              title="نسخ الرابط"
                           >
                             <LinkIcon size={16} />
                           </button>
                       </div>
                    </div>
                    <div className="flex gap-4 justify-center overflow-x-auto py-2 px-2">
                       {selectedProduct.variants.map((v, i) => (
                         <button key={i} onClick={() => setActiveVariantIdx(i)} className={`w-20 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeVariantIdx === i ? 'border-amber-600 scale-105 shadow-xl' : 'border-neutral-200 opacity-40 hover:opacity-100'}`}>
                           <img src={v.image} className="w-full h-full object-cover" alt="" />
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="w-full md:w-1/2 flex flex-col justify-center space-y-10 text-left">
                    <div className="space-y-4 text-left">
                       <div className="flex items-center gap-2 text-amber-600"><Star size={12} fill="currentColor" /> <span className="text-[10px] font-black uppercase tracking-[0.4em]">Excellence Heritage</span></div>
                       <h2 className="text-4xl md:text-6xl font-serif font-black text-neutral-900 leading-tight">{String(selectedProduct.name)}</h2>
                       <p className="text-3xl font-serif text-amber-700 font-bold">{Number(selectedProduct.price).toLocaleString()} DA</p>
                    </div>
                    <div className="space-y-6 text-left">
                       <p className="text-neutral-500 leading-relaxed text-sm">{String(selectedProduct.description) || "Une création artisanale raffinée."}</p>
                       <div className="grid grid-cols-2 gap-4 text-left">
                           <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100"><Clock size={16} className="text-amber-600" /><div><p className="text-[8px] font-bold text-neutral-400 uppercase">Expédition</p><p className="text-[10px] font-black text-neutral-800">48h Express</p></div></div>
                           <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100"><ShieldCheck size={16} className="text-amber-600" /><div><p className="text-[8px] font-bold text-neutral-400 uppercase">Matière</p><p className="text-[10px] font-black text-neutral-800">Cuir Véritable</p></div></div>
                       </div>
                    </div>
                    <div className="space-y-8 text-left py-8 border-y border-neutral-100">
                       <div className="space-y-3 text-left">
                           <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest text-left">Couleur: <span className="text-neutral-900">{String(selectedProduct.variants[activeVariantIdx]?.color)}</span></p>
                           <div className="flex flex-wrap gap-2 text-left">
                             {selectedProduct.variants.map((v, i) => (
                               <button key={i} onClick={() => setActiveVariantIdx(i)} className={`px-6 py-3 text-[10px] font-black uppercase border rounded-xl transition-all ${activeVariantIdx === i ? 'bg-neutral-900 text-white border-neutral-900 shadow-md transform scale-105' : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'}`}>
                                 {v.color}
                               </button>
                             ))}
                           </div>
                       </div>
                       <div className="space-y-3 text-left">
                           <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest text-left">Pointure</p>
                           <div className="grid grid-cols-5 md:grid-cols-7 gap-2 text-left">
                             {selectedProduct.sizes?.sort((a,b)=>a-b).map(size => (
                               <button key={size} onClick={() => setActiveSize(size)} className={`py-4 text-[10px] font-black border rounded-2xl transition-all ${activeSize === size ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white border-neutral-100 text-neutral-400 hover:border-amber-400'}`}>{size}</button>
                             ))}
                           </div>
                       </div>
                    </div>

                    {/* DIRECT PURCHASE FORM */}
                    <div className="bg-neutral-50 p-8 md:p-12 rounded-[3rem] border border-neutral-100 space-y-8 text-right shadow-sm" dir="rtl">
                       <div className="flex items-center gap-4 text-neutral-900 text-right">
                           <div className="p-3 bg-amber-100 rounded-2xl text-amber-700"><User size={24}/></div>
                           <h3 className="text-xl font-black">معلومات الشراء</h3>
                       </div>
                       <form onSubmit={handleOrder} className="space-y-6 text-right">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                            <input required placeholder="الاسم الكامل" className="w-full p-5 bg-white border border-neutral-200 rounded-2xl text-sm outline-none focus:border-amber-600 text-right" value={orderName} onChange={e=>setOrderName(e.target.value)} />
                            <input 
                              required 
                              type="tel" 
                              maxLength={10}
                              placeholder="رقم الهاتف (05/06/07...)" 
                              className="w-full p-5 bg-white border border-neutral-200 rounded-2xl text-sm outline-none focus:border-amber-600 text-right" 
                              value={orderPhone} 
                              onChange={e => {
                                // Only allow numbers
                                const val = e.target.value.replace(/\D/g, '');
                                setOrderPhone(val);
                              }} 
                            />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                            <select required className="w-full p-5 bg-white border border-neutral-200 rounded-2xl text-sm font-bold outline-none focus:border-amber-600 text-right appearance-none" value={selectedWilaya} onChange={e=>{setSelectedWilaya(e.target.value); setSelectedCommune('');}}>
                              <option value="" disabled>اختر الولاية</option>
                              {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                            <select required className="w-full p-5 bg-white border border-neutral-200 rounded-2xl text-sm font-bold outline-none focus:border-amber-600 text-right appearance-none" value={selectedCommune} onChange={e=>setSelectedCommune(e.target.value)} disabled={!selectedWilaya}>
                              <option value="" disabled>اختر البلدية</option>
                              {selectedWilaya && ALGERIA_DATA[selectedWilaya].sort().map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                         </div>
                         {selectedWilaya && (
                           <div className="grid grid-cols-2 gap-4 text-right animate-in fade-in">
                             <button type="button" onClick={() => setDeliveryMethod('home')} className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${deliveryMethod === 'home' ? 'border-amber-600 bg-amber-600/10 text-amber-600 shadow-md' : 'border-neutral-200 bg-white opacity-50 hover:opacity-100'}`}><Home size={20}/><span className="text-[10px] font-black">إلى المنزل</span><span className="text-[10px] font-bold">{(deliveryPrices[selectedWilaya]?.home || 0)} DA</span></button>
                             <button type="button" onClick={() => setDeliveryMethod('desk')} className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${deliveryMethod === 'desk' ? 'border-amber-600 bg-amber-600/10 text-amber-600 shadow-md' : 'border-neutral-200 bg-white opacity-50 hover:opacity-100'}`}><Building2 size={20}/><span className="text-[10px] font-black">إلى المكتب</span><span className="text-[10px] font-bold">{(deliveryPrices[selectedWilaya]?.desk || 0)} DA</span></button>
                           </div>
                         )}
                         <button type="submit" disabled={isOrdering || !selectedWilaya || !selectedCommune} className="w-full bg-black text-white py-6 rounded-[2rem] font-black uppercase text-center flex items-center justify-center gap-4 hover:bg-neutral-800 transition shadow-xl">
                            {isOrdering ? <Loader2 className="animate-spin" /> : "تأكيد الطلب"}
                         </button>
                       </form>
                       <div className="flex justify-center gap-8 pt-4 text-center mx-auto">
                           <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase"><CheckCircle size={14} className="text-amber-600"/><span className="text-center">الدفع عند الاستلام</span></div>
                           <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase"><CheckCircle size={14} className="text-amber-600"/><span className="text-center">إمكانية القياس</span></div>
                       </div>
                    </div>
                 </div>
              </div>
          </div>
        );
    }

    return (
      <>
        <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden pt-24">
          <div className="absolute inset-0 z-0 scale-110 transform animate-slow-zoom">
            <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600" className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative z-10 px-4 space-y-8 max-w-4xl text-center mx-auto">
            <h3 className="text-amber-400 text-sm font-black uppercase tracking-[0.6em] animate-in slide-in-from-bottom-8 duration-700">Excellence Artisanale Algérienne</h3>
            <h2 className="text-6xl md:text-9xl font-serif font-black leading-[0.9] text-center uppercase tracking-tighter animate-in slide-in-from-bottom-12 duration-1000">Style <br/><span className="italic font-light">Pur</span></h2>
            <div className="pt-10 animate-in slide-in-from-bottom-16 duration-1000 delay-200"><a href="#shop" className="bg-white text-black px-16 py-6 font-black uppercase text-xs tracking-[0.4em] hover:bg-amber-700 hover:text-white transition-all shadow-2xl inline-block rounded-full">Explorer</a></div>
          </div>
        </section>
        <section id="shop" className="py-24 bg-neutral-50 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center mx-auto">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {products.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-neutral-400 font-serif italic text-xl">La collection arrive bientôt...</p>
                    <button onClick={() => window.location.hash = '#admin'} className="mt-4 text-xs font-bold uppercase text-neutral-300 hover:text-neutral-500">Connexion Admin</button>
                </div>
            )}
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="relative font-sans text-neutral-900 bg-white min-h-screen selection:bg-amber-100 overflow-x-hidden">
      {view !== 'admin' && (
        <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-100 px-6 h-20 flex items-center justify-between animate-in slide-in-from-top duration-500">
          <div className="w-1/3 flex items-center gap-8 text-left">
            <button onClick={() => { if(view === 'landing') window.location.hash = 'admin'; else window.location.hash = ''; }} className="flex items-center gap-2 text-neutral-400 hover:text-black transition uppercase font-black text-[10px] tracking-[0.3em]">
                {view === 'landing' ? <Lock size={16} /> : <ArrowLeft size={16} />} 
                <span className="hidden md:inline">{view === 'landing' ? 'Admin' : 'Magasin'}</span>
            </button>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <button onClick={() => window.location.hash = ''} className="text-lg md:text-3xl font-serif font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-neutral-900 text-center whitespace-nowrap hover:scale-105 transition-transform">H&S<span className="text-amber-700 italic font-light"> Luxury</span></button>
          </div>
          <div className="w-1/3 flex justify-end">
            <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg">{orders.length}</div>
          </div>
        </nav>
      )}

      {renderContent()}

      {showLogin && <LoginGate onLoginSuccess={() => { setIsLoggedIn(true); window.location.hash = 'admin'; setShowLogin(false); }} onCancel={() => { setShowLogin(false); window.location.hash = ''; }} />}
      
      {toast.show && (
        <div className={`fixed bottom-12 left-12 px-8 py-4 z-[200] flex items-center gap-4 border-l-8 shadow-2xl rounded-r-2xl animate-in slide-in-from-left transition-all ${toast.type === 'error' ? 'bg-red-50 text-red-800 border-red-600' : 'bg-black text-white border-amber-600'}`}>
            <CheckCircle size={14} className={toast.type === 'error' ? 'text-red-600' : 'text-amber-600'}/>
            <span className="text-[10px] font-black uppercase tracking-widest">{toast.msg}</span>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        @keyframes slow-zoom { from { transform: scale(1); } to { transform: scale(1.05); } }
        .animate-slow-zoom { animation: slow-zoom 20s infinite alternate ease-in-out; }
      `}</style>
    </div>
  );
}