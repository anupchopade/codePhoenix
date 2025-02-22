# Python 2 class example
class OldStyleClass:
    def __init__(self):
        print "Initializing"
    
    def divide(self, a, b):
        return a / b
    
    def handle_error(self):
        try:
            self.some_method()
        except (ValueError, TypeError), e:
            print "Error:", e

# Dictionary methods
my_dict = {'a': 1, 'b': 2}
for key, value in my_dict.iteritems():
    print key, value 