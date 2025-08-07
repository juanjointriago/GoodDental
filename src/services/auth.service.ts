/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { getItemById, setItem } from "../db/fb.helper";
import type { IUser } from "../stores/auth.store";


export class AuthService {
  static login = async (
    email: string,
    password: string
  ): Promise<{ user?: IUser; isAuthenticated: boolean; message: string }> => {  
    const auth = getAuth();
    console.debug("✅login", { email, password });
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.debug("✅", user.displayName);
      const firebaseUser = await getItemById<IUser>(
        import.meta.env.VITE_COLLECTION_USERS,
        user.uid
      );
      console.debug("Auth.Service/static login/ getItemById=>", {
        firebaseUser,
      });
      if (firebaseUser && firebaseUser.isActive === false) {
        await signOut(auth);
        return { isAuthenticated: false, message: 'Su usuario está en proceso de aprobación' };
      }
      if (firebaseUser && firebaseUser.isActive) {
        return { isAuthenticated: true, user: firebaseUser, message: `Bienvenido ${firebaseUser.name}` };
      }
      return { isAuthenticated: false, message: 'Usuario no encontrado' };
    } catch (error: any) {
      console.debug({ error });
      return { isAuthenticated: false, message: `Error al iniciar sesión: ${error.message}` };
    }
  };

  static resetPassword = async (email: string): Promise<{  isAuthenticated: boolean; message: string }> => {
    const auth = getAuth();
    try {
      console.log('reseteando contrasena', email);
      await sendPasswordResetEmail(auth, email);
      return { isAuthenticated: true, message: `Reinicio de Contraseña: Revise la bandeja de ${email}` };
    } catch (error: any) {
      return { isAuthenticated: true, message: `Error al enviar correo: ${error.message}` };
    }
  };

  static signUp = async (signUpUser: IUser): Promise<{ isAuthenticated: boolean; message: string }> => {
    const {
      email,
      password,
      name,
      role,
      address,
      bornDate,
      cc,
      phone,
      city,
      country,
    } = signUpUser;
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password!
      );
      if (userCredential) {
        const { photoURL, uid } = userCredential.user;
        const dataUser:IUser = {
          id: uid,
          name,
          email,
          password: password || ''  ,
          role,
          photoURL: photoURL || '',
          phone,
          address,
          bornDate,
          cc,
          city,
          country,
          isActive: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await updateProfile(userCredential.user, { displayName: name });
        await setItem(import.meta.env.VITE_COLLECTION_USERS, dataUser);
        //Add preffered info and Total fee for user
        await signOut(auth);
        return { isAuthenticated: true, message: 'Registro completo: Su cuenta se encuentra en proceso de activación' };
      }
      return { isAuthenticated: false, message: 'No se pudo registrar el usuario' };
    } catch (error: any) {
      await signOut(auth);
      return { isAuthenticated: false, message: `Error al registrar usuario: ${error.message}` };
    }
  };
  /**
   * @description Login with Google and set on user collection if not exists if exists continue
   * @param action
   * @returns
   */
  static googleSignUpLogin = async (): Promise<{ user?: IUser; isAuthenticated:boolean; message: string }> => {
    const auth = getAuth();
    const googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({
      prompt: "select_account ",
    });

    try {
      const { user } = await signInWithPopup(auth, googleAuthProvider);
      const { uid, email, displayName, photoURL } = user;
      const firebaseUser = await getItemById<IUser>(
        import.meta.env.VITE_COLLECTION_USERS,
        uid
      );
      if (!firebaseUser?.id) {
        const dataUser:IUser = {
          id: uid,
          name: displayName || '',
          email: email || '',
          role: "employee",
          password: firebaseUser.password || '',    
          photoURL: photoURL || '',
          phone: "",
          address: "",
          bornDate: 0,
          cc: "",
          city: "",
          country: "",
          isActive: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await setItem(import.meta.env.VITE_COLLECTION_USERS, dataUser);
        await signOut(auth);
        return { isAuthenticated: true, message: 'Registro completo: Su cuenta se encuentra en proceso de activación' };
      }
      if (!firebaseUser.isActive) {
        await signOut(auth);
        return { isAuthenticated: false, message: 'Su usuario está en proceso de aprobación' };
      }
      return { isAuthenticated: true, user: firebaseUser, message: `Bienvenido ${firebaseUser.name}` };
    } catch (error: any) {
      console.debug({ error });
      return { isAuthenticated: false, message: `Error al iniciar sesión con GOOGLE: ${error.message}` };
    }
  };

  // static signUpGateway = async (sigUpUser: FirestoreUser) => {
  //     const auth = getAuth();
  //     const { email, password, name, role, phone, address, bornDate, cc, city, country } = sigUpUser;
  //     const { user } = await createUserWithEmailAndPassword(auth, email, password!)
  //     const { photoURL, uid } = user;
  //     const dataUser = {
  //         uid,
  //         id: uid,
  //         name,
  //         email,
  //         role,
  //         photoUrl: photoURL,
  //         phone,
  //         address,
  //         bornDate,
  //         cc,
  //         city,
  //         country,
  //         isActive: false,
  //         createdAt: Date.now(),
  //     };

  //     await updateProfile(user, { displayName: name });
  //     await setItem(import.meta.env.VITE_COLLECTION_USERS, dataUser);
  //     await signOut(auth);
  // }

  static checkStatus = async (): Promise<IUser | undefined> => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      try {
        const FirestoreUser = await getItemById<IUser>(
          import.meta.env.VITE_COLLECTION_USERS,
          user.uid
        );
        return FirestoreUser;
      } catch (error) {
        console.debug(error);
        throw new Error("Unauthorized, invalid token");
      }
    }
  };

  static logout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };
}
