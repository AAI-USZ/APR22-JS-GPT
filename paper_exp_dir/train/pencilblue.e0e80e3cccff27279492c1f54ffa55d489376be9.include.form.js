global.prepareFormReturns = function(session, result, output)
{
displayErrorOrSuccess(session, result, function(newSession, newResult)
{
checkForFormRefill(newSession, newResult, output);
});
}

global.setFormFieldValues = function(post, session)
{
session.fieldValues = post;
return session;
