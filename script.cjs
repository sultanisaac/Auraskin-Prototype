const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

const old_desktop = `        <div className="hidden md:flex items-center space-x-4 lg:space-x-5">\n          <Link href="/book-consultation">`;
const new_desktop = `        <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
          <button onClick={openCart} className="relative p-2 text-gray-600 hover:text-primary transition-colors focus:outline-none group">
            <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
            {mounted && getTotalItems() > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {getTotalItems()}
              </span>
            )}
          </button>
          <Link href="/book-consultation">`;

const old_mobile = `        {/* Hamburger Menu Icon */}\n        <button \n          onClick={() => setIsOpen(!isOpen)} \n          className="md:hidden p-2 text-primary focus:outline-none relative z-[60] active:scale-95 transition-transform"`;
const new_mobile = `        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3 relative z-[60]">
          <button onClick={openCart} className="relative p-2 text-primary focus:outline-none active:scale-95 transition-transform">
            <ShoppingBag className="w-6 h-6" />
            {mounted && getTotalItems() > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {getTotalItems()}
              </span>
            )}
          </button>
          {/* Hamburger Menu Icon */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-primary focus:outline-none active:scale-95 transition-transform"`;

const old_drawer = `        )}\n      </AnimatePresence>\n    </header>\n  );\n};`;
const new_drawer = `        )}\n      </AnimatePresence>\n      <CartDrawer />\n    </header>\n  );\n};`;

content = content.replace(old_desktop, new_desktop).replace(old_desktop.replace(/\n/g, '\r\n'), new_desktop);
content = content.replace(old_mobile, new_mobile).replace(old_mobile.replace(/\n/g, '\r\n'), new_mobile);
content = content.replace(old_drawer, new_drawer).replace(old_drawer.replace(/\n/g, '\r\n'), new_drawer);

fs.writeFileSync('src/components/Header.tsx', content);
console.log('Header.tsx updated successfully');
