import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const injected = `
    (function() {
      function safe(fnName) {
        return (typeof window[fnName] === 'function') ? window[fnName] : function(){};
      }
      function isVisible(el) {
        if (!el) return false;
        var style = window.getComputedStyle ? window.getComputedStyle(el) : el.style;
        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      }
      function isNamePromptVisible() { return isVisible(document.getElementById('nameInput')); }
      function isStartScreenVisible() { return isVisible(document.getElementById('startScreen')); }
      function isGameOverVisible() { return isVisible(document.getElementById('gameOverScreen')); }

      var TAP_THRESHOLD_MS = 140; // shorter tap window
      var touchStartTime = 0;
      var duckingViaHold = false;
      var duckInterval = null;

      function swallow(ev){
        try { ev.preventDefault(); } catch(_){}
        try { ev.stopImmediatePropagation(); } catch(_){}
        try { ev.stopPropagation(); } catch(_){}
        return false;
      }

      function beginHoldDuck(){
        if (duckInterval) return;
        duckInterval = setInterval(function(){ safe('duck')(); }, 16); // 60fps attempts
      }
      function endHoldDuck(){
        if (duckInterval) { clearInterval(duckInterval); duckInterval = null; }
        safe('stopDuck')();
      }

      function onTouchStart(ev) {
        swallow(ev);
        touchStartTime = Date.now();

        if (isNamePromptVisible() || isStartScreenVisible() || isGameOverVisible()) {
          duckingViaHold = false;
          return;
        }
        duckingViaHold = true;
        beginHoldDuck();
      }

      function onTouchEnd(ev) {
        swallow(ev);
        var duration = Date.now() - touchStartTime;

        if (isNamePromptVisible()) { duckingViaHold = false; endHoldDuck(); return; }

        if (duckingViaHold) {
          endHoldDuck();
          if (duration < TAP_THRESHOLD_MS) {
            if (isGameOverVisible()) { safe('restartGame')(); }
            else if (isStartScreenVisible()) { safe('startGame')(); }
            else { safe('jump')(); }
          }
          duckingViaHold = false;
          return;
        }

        if (isGameOverVisible()) { safe('restartGame')(); return; }
        if (isStartScreenVisible()) { safe('startGame')(); return; }
        safe('jump')();
      }

      function onTouchCancel(ev) {
        swallow(ev);
        duckingViaHold = false; endHoldDuck();
      }

      function onTouchMove(ev) { swallow(ev); }

      var canvas = document.getElementById('gameCanvas');
      document.addEventListener('touchstart', onTouchStart, { passive: false, capture: true });
      document.addEventListener('touchend', onTouchEnd, { passive: false, capture: true });
      document.addEventListener('touchcancel', onTouchCancel, { passive: false, capture: true });
      document.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
      if (canvas) {
        canvas.addEventListener('touchstart', onTouchStart, { passive: false, capture: true });
        canvas.addEventListener('touchend', onTouchEnd, { passive: false, capture: true });
        canvas.addEventListener('touchcancel', onTouchCancel, { passive: false, capture: true });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
      }
      document.addEventListener('click', swallow, { passive: false, capture: true });
    })(); true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />
      <WebView
        originWhitelist={["*"]}
        source={require('./game.html')}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScript={injected}
        allowsInlineMediaPlayback
        allowFileAccess
        allowingReadAccessToURL={"/"}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  webview: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
});
