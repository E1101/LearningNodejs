/*
 * The last thing to note about ES2015 module code is that import
 * and export statements must be top-level code.
 *
 * Results in an error:
 * $ node --experimental-modules 04-adding_users-product_filtering-badexport.mjs
 */
{
    export const meaning = 42;
}
