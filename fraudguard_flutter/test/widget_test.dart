import 'package:flutter_test/flutter_test.dart';
import 'package:fraudguard_flutter/main.dart';

void main() {
  testWidgets('FlashGuard App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const FlashGuardApp());
    expect(find.text('FlashGuard Pro Mobile'), findsNothing);
  });
}
