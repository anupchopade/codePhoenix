# Python 2 example code
print "Hello, World!"
print "Multiple", "arguments", "here"
print >> sys.stderr, "Error message"

# Division example
result = 10 / 3
print "Result:", result

# Exception handling
try:
    raise Exception("Test error")
except Exception, e:
    print e

# Unicode example
unicode_str = u"Hello, Unicode!"
print unicode_str 