package org.apache.cordova.plugin;

import android.content.Context;

import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.apache.cordova.LOG;
import android.provider.Settings;
import android.net.wifi.WifiInfo;
import android.text.TextUtils;


//Modified by itsoft 18/04/2022: Include airplane mode detection and wifidbm.

public class SignalStrength extends CordovaPlugin {

@Override
public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        if (action.equals("dbm")) {
                ssListener = new SignalStrengthStateListener();
                TelephonyManager tm = (TelephonyManager) cordova.getActivity().getSystemService(Context.TELEPHONY_SERVICE);
                tm.listen(ssListener, PhoneStateListener.LISTEN_SIGNAL_STRENGTHS);
                int counter = 0;
                while ( dbm == -1) {
                        try {
                                Thread.sleep(200);
                        } catch (InterruptedException e) {
                                e.printStackTrace();
                        }
                        if (counter++ >= 5)
                        {
                                break;
                        }
                }
                callbackContext.success(dbm);
                return true;
        }
		
		if (action.equals("checkAirPlaneModeOn")) {
			Context context = cordova.getActivity().getApplicationContext();
			try {
                int airPlaneModeState = Settings.Global.getInt(
                        context.getContentResolver(),
                        Settings.Global.AIRPLANE_MODE_ON,
						0);

                callbackContext.success(airPlaneModeState);
				return true;

            } catch (Exception e) {
                LOG.d("SignalStrength", "Error checking air plane mode state " + e);
                callbackContext.success(0);
				return true;
            }
			
		}

        if (action.equals("wifidbm")) {
                int rssi = -1;
                ConnectivityManager cm = (ConnectivityManager) cordova.getActivity().getSystemService(Context.CONNECTIVITY_SERVICE);
                NetworkInfo networkInfo = cm.getActiveNetworkInfo();
                if (networkInfo == null) {
                        rssi = -1;
                }

                if (networkInfo.isConnected()) {
                        final WifiManager wifiManager = (WifiManager) cordova.getActivity().getApplicationContext().getSystemService(Context.WIFI_SERVICE);
                        final WifiInfo connectionInfo = wifiManager.getConnectionInfo();
                        if (connectionInfo != null) {
                                rssi = connectionInfo.getRssi();
                        }
                }
                callbackContext.success(rssi);
                return true;
        }
		

        return false;
}


class SignalStrengthStateListener extends PhoneStateListener {

@Override
public void onSignalStrengthsChanged(android.telephony.SignalStrength signalStrength) {
        super.onSignalStrengthsChanged(signalStrength);
        int tsNormSignalStrength = signalStrength.getGsmSignalStrength();
        dbm = (2 * tsNormSignalStrength) - 113;     // -> dBm
}

}

SignalStrengthStateListener ssListener;
int dbm = -1;

}
