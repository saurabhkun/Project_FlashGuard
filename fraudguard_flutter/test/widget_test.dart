import 'package:flutter_test/flutter_test.dart';
import 'package:fraudguard_flutter/main.dart';

void main() {
  testWidgets('FlashGuard App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const FlashGuardApp());
    // Pump past the 2-second splash screen timer
    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();
    expect(find.text('FlashGuard'), findsWidgets);
  });
}
