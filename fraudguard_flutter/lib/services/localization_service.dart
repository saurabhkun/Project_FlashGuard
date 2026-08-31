import 'package:flutter/material.dart';

class AppLanguage extends ChangeNotifier {
  static final AppLanguage _instance = AppLanguage._internal();
  factory AppLanguage() => _instance;
  AppLanguage._internal();

  String _currentLang = 'en'; // 'en' or 'hi'
  String get currentLang => _currentLang;

  bool get isHindi => _currentLang == 'hi';

  void setLanguage(String langCode) {
    if (_currentLang != langCode) {
      _currentLang = langCode;
      notifyListeners();
    }
  }

  void toggleLanguage() {
    _currentLang = _currentLang == 'en' ? 'hi' : 'en';
    notifyListeners();
  }

  static String t(String key) {
    return _localizedValues[_instance._currentLang]?[key] ??
        _localizedValues['en']![key] ??
        key;
  }

  static const Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'appName': 'FlashGuard',
      'tagline': 'Antivirus Protection for Your Payments',
      'protectionStatus': 'Protection Status',
      'protected': 'PROTECTED',
      'protectedSub': 'Your payments are scanned in real time.',
      'limitedProtection': 'OFFLINE MODE',
      'limitedSub': 'Connect backend for AI fraud protection.',
      'threatLevel': 'Threat Level',
      'threatLow': 'Low (Safe)',
      'threatMed': 'Medium (Review)',
      'threatHigh': 'High (Quarantined)',
      'recentScans': 'Recent Scans & Protection Log',
      'payScan': 'Scan & Pay',
      'history': 'Scan Log',
      'settings': 'Settings',
      'home': 'Home',
      'demoLogin': 'Demo Login',
      'demoNotice': 'DEMO MODE — For demonstration only. Enter any 6-digit OTP.',
      'enterPhone': 'Mobile Number',
      'sendOtp': 'SEND OTP',
      'enterOtp': 'Enter 6-Digit OTP',
      'verifyLogin': 'VERIFY & CONTINUE',
      'demoPresets': 'DEMO SCENARIOS — Tap to test',
      'safeDemo': '✓ Safe ₹500',
      'reviewDemo': '⚠ Review ₹8,500',
      'blockDemo': '✕ Quarantine ₹15,000',
      'recipientLabel': 'Recipient Phone / UPI ID',
      'amountLabel': 'Amount (₹)',
      'locationLabel': 'Your Location',
      'analyzeBtn': 'SCAN & PROTECT PAYMENT',
      'scanning': 'Scanning payment security…',
      'verdictSafe': 'PAYMENT PROTECTED',
      'verdictReview': 'NEEDS REVIEW BEFORE PAYMENT',
      'verdictBlock': 'PAYMENT QUARANTINED',
      'safeSub': 'No threats detected. Safe to complete payment.',
      'reviewSub': 'Unusual transaction detected. Please double check recipient.',
      'blockSub': 'Suspicious recipient or fraud pattern detected. Payment stopped.',
      'continueBtn': 'CONTINUE PAYMENT',
      'cancelBtn': 'CANCEL PAYMENT',
      'returnHome': 'RETURN TO SAFETY',
      'language': 'Language / भाषा',
      'english': 'English',
      'hindi': 'हिंदी',
      'scansToday': 'Scans Today',
      'blockedToday': 'Quarantined Today',
      'quarantinedTitle': 'QUARANTINED',
      'safeTitle': 'CLEAN & SAFE',
      'reviewTitle': 'UNDER REVIEW',
      'viewAll': 'View All Log',
      'advancedSettings': 'Developer & System Details',
      'developerMode': 'Advanced Engine Details',
      'aiEngineStatus': 'FraudGuard AI Engine',
      'version': 'Version',
      'modelType': 'Model Type',
      'features': 'Features Evaluated',
      'modelLoaded': 'Status',
      'logout': 'Switch Demo Account / Logout',
    },
    'hi': {
      'appName': 'फ्लैशगार्ड',
      'tagline': 'आपके भुगतानों के लिए एंटीवायरस सुरक्षा',
      'protectionStatus': 'सुरक्षा स्थिति',
      'protected': 'सुरक्षित',
      'protectedSub': 'आपके भुगतानों की रीयल-टाइम जांच की जा रही है।',
      'limitedProtection': 'ऑफलाइन मोड',
      'limitedSub': 'AI सुरक्षा के लिए सर्वर कनेक्ट करें।',
      'threatLevel': 'खतरा स्तर',
      'threatLow': 'कम (सुरक्षित)',
      'threatMed': 'मध्यम (जांचें)',
      'threatHigh': 'उच्च (अवरुद्ध)',
      'recentScans': 'हालिया स्कैन और सुरक्षा लॉग',
      'payScan': 'स्कैन और भुगतान',
      'history': 'स्कैन लॉग',
      'settings': 'सेटिंग्स',
      'home': 'होम',
      'demoLogin': 'डेमो लॉगिन',
      'demoNotice': 'डेमो मोड — केवल प्रदर्शन के लिए। कोई भी 6-अंकों का OTP दर्ज करें।',
      'enterPhone': 'मोबाइल नंबर',
      'sendOtp': 'OTP भेजें',
      'enterOtp': '6-अंकों का OTP दर्ज करें',
      'verifyLogin': 'सत्यापित करें और आगे बढ़ें',
      'demoPresets': 'डेमो परिदृश्य — जांचने के लिए टैप करें',
      'safeDemo': '✓ सुरक्षित ₹500',
      'reviewDemo': '⚠ समीक्षा ₹8,500',
      'blockDemo': '✕ क्वारंटाइन ₹15,000',
      'recipientLabel': 'प्राप्तकर्ता का फोन / UPI ID',
      'amountLabel': 'राशि (₹)',
      'locationLabel': 'आपका स्थान',
      'analyzeBtn': 'स्कैन और सुरक्षित भुगतान',
      'scanning': 'सुरक्षा स्कैन किया जा रहा है…',
      'verdictSafe': 'भुगतान पूरी तरह सुरक्षित है',
      'verdictReview': 'भुगतान से पहले जांचें',
      'verdictBlock': 'भुगतान क्वारंटाइन (रोका गया)',
      'safeSub': 'कोई खतरा नहीं मिला। भुगतान करना सुरक्षित है।',
      'reviewSub': 'असामान्य लेनदेन मिला। कृपया प्राप्तकर्ता की जांच करें।',
      'blockSub': 'संदिग्ध प्राप्तकर्ता या धोखाधड़ी मिली। भुगतान रोका गया।',
      'continueBtn': 'भुगतान जारी रखें',
      'cancelBtn': 'भुगतान रद्द करें',
      'returnHome': 'सुरक्षित स्थान पर लौटें',
      'language': 'भाषा / Language',
      'english': 'English',
      'hindi': 'हिंदी',
      'scansToday': 'आज के स्कैन',
      'blockedToday': 'आज क्वारंटाइन किए गए',
      'quarantinedTitle': 'क्वारंटाइन (अवरुद्ध)',
      'safeTitle': 'सुरक्षित',
      'reviewTitle': 'समीक्षाधीन',
      'viewAll': 'पूरा लॉग देखें',
      'advancedSettings': 'डेवलपर एवं सिस्टम विवरण',
      'developerMode': 'उन्नत इंजन विवरण',
      'aiEngineStatus': 'फ्रॉडगार्ड AI इंजन',
      'version': 'संस्करण',
      'modelType': 'मॉडल प्रकार',
      'features': 'जांचे गए पैरामीटर',
      'modelLoaded': 'स्थिति',
      'logout': 'डेमो अकाउंट बदलें / लॉगआउट',
    }
  };
}
