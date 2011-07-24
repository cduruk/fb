require 'sinatra/base'

class FB < Sinatra::Base
  set :root, File.dirname(__FILE__)

  get '/' do
    erb :index, :layout => false
  end

end